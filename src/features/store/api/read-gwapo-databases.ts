import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import { api } from ".";

import { PouchDB } from "../../pouch";
import { dbNameToDumpDbName } from "../../streams/DumpToPouch/actions";
import type { DumpHeaderDocument } from "../../streams/DumpToPouch/types";

const databaseDumpAdapter = createEntityAdapter<
  { id: string } & EntityState<DumpHeaderDocument>
>({
  /** Assuming we don't perform this operation often. Not ideal. */
  sortComparer(headerA, headerB) {
    // header id looks like `gwapo_{timestamp}`
    return (
      new Date(`${headerB.id}`.split("_")[1] ?? 0).getTime() -
      new Date(`${headerA.id}`.split("_")[1] ?? 0).getTime()
    );
  },
});
const databaseDumpSelectors = databaseDumpAdapter.getSelectors();

const partialDumpAdapter = createEntityAdapter<DumpHeaderDocument>({
  selectId(header) {
    return header._id;
  },
});

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readGwapoDatabases: build.query<
        EntityState<{ id: string } & EntityState<DumpHeaderDocument>>,
        {}
      >({
        providesTags(result, error) {
          return [
            { type: "internal/pouches", id: "LIST" },
            { type: "internal/pouches", id: "PROGRESS" },
          ];
        },
        queryFn(queryArguments, queryApi) {
          const pouch = new PouchDB("gwapo", {
            adapter: "indexeddb",
          });
          return pouch
            .allDocs({
              conflicts: false,
              endkey: "gwapo_\ufff0",
              include_docs: true,
              startkey: "gwapo_",
            })
            .then((documents) => {
              return {
                data: documents.rows.reduce((acc, row) => {
                  const dumpDbName = dbNameToDumpDbName(
                    row.doc as any as DumpHeaderDocument
                  );
                  return databaseDumpAdapter.upsertOne(acc, {
                    id: dumpDbName,
                    ...partialDumpAdapter.addOne(
                      databaseDumpSelectors.selectById(acc, dumpDbName) ??
                        partialDumpAdapter.getInitialState(),
                      row.doc as any as DumpHeaderDocument
                    ),
                  });
                }, databaseDumpAdapter.getInitialState()),
              };
            });
        },
      }),
    };
  },
});

export const readGwapoDatabases = injectedApi.endpoints.readGwapoDatabases;

export const partialDumpFinished = ({
  seq,
  db_info: { update_seq },
}: DumpHeaderDocument) => seq === update_seq;
export const dumpFinished = (
  dumps: { id: string } & EntityState<DumpHeaderDocument>
) => dumps.ids.every((dumpId) => partialDumpFinished(dumps.entities[dumpId]!));
export const firstDumpFinished = (queryResult: {
  data?: EntityState<{ id: string } & EntityState<DumpHeaderDocument>>;
}) =>
  queryResult.data?.ids.find((dumpId) =>
    dumpFinished(queryResult.data?.entities[dumpId]!)
  );

/** Not quite a thunk. queryFn helper to select a database name or reject if none is ready */
export function getDatabaseName(
  queryApi: Pick<BaseQueryApi, "dispatch" | "getState">
) {
  const subscription = queryApi.dispatch(
    readGwapoDatabases.initiate({}, { forceRefetch: true, subscribe: false })
  );
  return subscription
    .unwrap()
    .then((queryResult) => {
      const bestDatabase =
        firstDumpFinished({ data: queryResult }) ?? queryResult.ids[0];
      if (!bestDatabase || typeof bestDatabase !== "string") {
        return Promise.reject("No database ready");
      }
      return bestDatabase;
    })
    .finally(() => {
      subscription.unsubscribe();
    });
}
