import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";
import throttle from "lodash.throttle";

import { api } from ".";

import { PouchDB } from "../../pouch";
import { DumpToPouchSink } from "../../streams/DumpToPouch";
import { DumpStreamActions } from "../../streams/DumpToPouch/actions";
import { NewlineDelimitedJsonTransformer } from "../../streams/NewlineDelimitedJson";
import { DumpHeaderDocument } from "../../streams/DumpToPouch/types";

export interface UpdateGwapoDatabaseDumpArguments {}

export type UpdateGwapoDatabaseResult = null;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      updateGwapoDatabaseDump: build.mutation<
        UpdateGwapoDatabaseResult,
        UpdateGwapoDatabaseDumpArguments
      >({
        invalidatesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        /**
         * Reports progress for the database specified in dump.txt.
         * Since only one dump can be present in a deployment,
         * there is no use-case to track progress for multiple databases.
         * TODO: Changes are _really_ fast during a dump. Throttling state updates would be good.
         */
        onCacheEntryAdded(queryArguments, queryApi) {
          const tagInvalidationAction = injectedApi.util.invalidateTags([
            { type: "internal/pouches", id: "PROGRESS" },
          ]);
          const throttledOnChange = throttle(
            (change: PouchDB.Core.ChangesResponseChange<{}>) => {
              queryApi.dispatch(tagInvalidationAction);
            },
            420,
            { leading: true }
          );
          const observer = new PouchDB("gwapo", {
            adapter: "indexeddb",
          })
            .changes({
              filter: (doc) => doc._id?.startsWith("gwapo") ?? false,
              include_docs: true,
              live: true,
              return_docs: true,
              since: "now",
            })
            .on("change", (change) => {
              throttledOnChange(change);
              const partialDump = change.doc as any as DumpHeaderDocument;
              const partialDumpProgressRatio = Math.round(
                (partialDump!.seq / (partialDump?.db_info.doc_count ?? 1)) * 100
              );
              if (partialDumpProgressRatio >= 100) {
                queryApi.dispatch(
                  injectedApi.util.invalidateTags([
                    {
                      type: "internal/pouches",
                      id: partialDump.db_info.db_name.split("_").at(-1),
                    },
                  ])
                );
              }
            });

          Promise.race([
            queryApi.cacheDataLoaded,
            queryApi.cacheEntryRemoved,
          ]).finally(() => {
            observer.cancel();
          });
        },
        queryFn(
          queryArguments: UpdateGwapoDatabaseDumpArguments,
          queryApi: BaseQueryApi
        ) {
          return Promise.all(
            ["achievements", "currencies", "items", "materials", "skins"].map(
              (dumpFileName) =>
                fetch(`${process.env.PUBLIC_URL}/dump-${dumpFileName}.txt`, {
                  signal: queryApi.signal,
                }).then((response) => {
                  if (!response.body || response.status !== 200) {
                    return Promise.reject(new Error("Invalid response"));
                  }
                  return response.body
                    .pipeThrough(
                      new TransformStream(new NewlineDelimitedJsonTransformer())
                    )
                    .pipeTo(
                      new WritableStream(
                        new DumpToPouchSink(new DumpStreamActions())
                      ),
                      { signal: queryApi.signal }
                    )
                    .catch((reason: Error) => {
                      reason.cause = dumpFileName;
                      return Promise.reject(reason);
                    });
                })
            )
          )
            .then(() => {
              return { data: null, error: undefined };
            })
            .catch((reason) => {
              queryApi.abort(); // kill running fetches and streams
              return { data: undefined, error: reason.toString() };
            });
        },
      }),
    };
  },
});

export const updateGwapoDatabaseDump =
  injectedApi.endpoints.updateGwapoDatabaseDump;
