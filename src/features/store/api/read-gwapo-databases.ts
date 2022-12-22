import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import type { RootState } from "..";
import { api } from ".";

import { PouchDB } from "../../pouch";
import type { DumpHeaderDocument } from "../../streams/DumpToPouch/types";

const databaseEntityAdapter = createEntityAdapter<DumpHeaderDocument>({
  selectId(header) {
    return header._id;
  },
  sortComparer(headerA, headerB) {
    return (
      new Date(headerB.start_time).getTime() -
      new Date(headerA.start_time).getTime()
    );
  },
});
const databaseSelectors = databaseEntityAdapter.getSelectors();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readGwapoDatabases: build.query<EntityState<DumpHeaderDocument>, {}>({
        providesTags(result, error) {
          return (result?.ids ?? []).reduce(
            (acc, databaseName) =>
              acc.concat([
                {
                  type: "internal/pouches",
                  id: databaseName as string,
                },
              ]),
            [{ type: "internal/pouches", id: "LIST" }]
          );
        },
        queryFn(queryArguments, queryApi) {
          const pouch = new PouchDB("gwapo-db", {
            adapter: "indexeddb",
          });
          return pouch
            .allDocs({
              conflicts: false,
              include_docs: true,
            })
            .then((documents) => {
              return {
                data: documents.rows.reduce((acc, row) => {
                  if ((row.doc as any)?.$id !== "dump") {
                    return acc;
                  }
                  return databaseEntityAdapter.setOne(
                    acc,
                    row.doc as any as DumpHeaderDocument
                  );
                }, databaseEntityAdapter.getInitialState()),
              };
            });
        },
      }),
    };
  },
});

export const readGwapoDatabases = injectedApi.endpoints.readGwapoDatabases;

/** Selects the newest database with 100% data available */
export const selectBestDatabase = createSelector(
  readGwapoDatabases.select({}),
  (queryResult) => {
    return queryResult.data?.ids.find((databaseName) => {
      const {
        seq,
        db_info: { update_seq },
      } = databaseSelectors.selectById(queryResult.data!, databaseName)!;
      return seq === update_seq;
    });
  }
);

/** Not quite a thunk. queryFn helper to select a database name or reject if none is ready */
export function getDatabaseName(
  queryApi: Pick<BaseQueryApi, "dispatch" | "getState">
) {
  const subscription = queryApi.dispatch(readGwapoDatabases.initiate({}));
  return subscription
    .unwrap()
    .then(() => selectBestDatabase(queryApi.getState() as RootState))
    .then((bestDatabase) => {
      if (!bestDatabase || typeof bestDatabase !== "string") {
        return Promise.reject("No database ready");
      }
      return bestDatabase;
    })
    .finally(() => {
      subscription.unsubscribe();
    });
}
