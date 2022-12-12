import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from "../api";

import { PouchDB } from "../../pouch";
import type { DumpHeaderDocument } from "../../streams/DumpToPouch/types";

const databaseEntityAdapter = createEntityAdapter<DumpHeaderDocument>({
  selectId(header) {
    return header._id;
  },
  sortComparer(headerA, headerB) {
    return (
      new Date(headerA.start_time).getMilliseconds() -
      new Date(headerB.start_time).getMilliseconds()
    );
  },
});
const databaseSelectors = databaseEntityAdapter.getSelectors();

const injectedApi = api.injectEndpoints({
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
            .then((documents) => ({
              data: documents.rows.reduce((acc, row) => {
                if ((row.doc as any)?.$id !== "dump") {
                  return acc;
                }
                return databaseEntityAdapter.setOne(
                  acc,
                  row.doc as any as DumpHeaderDocument
                );
              }, databaseEntityAdapter.getInitialState()),
            }));
        },
      }),
    };
  },
});

export const readGwapoDatabases = injectedApi.endpoints.readGwapoDatabases;

/** Selects the newest database with 100% data available */
export const selectBestDatabase = createSelector(
  readGwapoDatabases.select({}),
  (queryResult) =>
    queryResult.data?.ids.find((databaseName) => {
      const {
        seq,
        db_info: { doc_count },
      } = databaseSelectors.selectById(queryResult.data!, databaseName)!;
      return seq === doc_count;
    })
);
