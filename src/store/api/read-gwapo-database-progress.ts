import { createSelector } from "@reduxjs/toolkit";

import { api } from "../api";

import { PouchDB } from "../../features/pouch";
import {
  DumpHeader,
  DumpHeaderDocument,
} from "../../features/streams/DumpToPouch/types";
import { NewlineDelimitedJsonTransformer } from "../../features/streams/NewlineDelimitedJson";
import { toDumpDatabaseName } from "../../features/streams/DumpToPouch/actions";

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readGwapoDatabases: build.query<DumpHeaderDocument, {}>({
        async onCacheEntryAdded(queryArguments, queryApi) {
          const { data: header } = await queryApi.cacheDataLoaded;
          const observer = new PouchDB("gwapo-db", {
            adapter: "indexeddb",
          }).changes({
            doc_ids: [toDumpDatabaseName(header)],
            include_docs: true,
            live: true,
            return_docs: true,
            since: "now",
          });

          observer
            .on("change", function onChange(change) {
              if (change.doc) {
                queryApi.updateCachedData(
                  () => change.doc as any as DumpHeaderDocument
                );
              }
            })
            .on("complete", function onComplete(info) {
              console.debug("changes feed complete", info);
            })
            .on("error", function onError(error) {
              console.error("changes feed error", error);
            });

          queryApi.cacheEntryRemoved.finally(() => {
            observer.cancel();
          });
        },
        queryFn(queryArguments, queryApi) {
          return fetch(`${process.env.PUBLIC_URL}/dump.txt`, {
            signal: queryApi.signal,
          })
            .then((response) => {
              if (!response.body) {
                return Promise.reject(new Error("Invalid response"));
              }
              const ready = response.body
                .pipeThrough(
                  new TransformStream(new NewlineDelimitedJsonTransformer())
                )
                .getReader();
              return ready
                .read()
                .then(({ value }) => {
                  if ("version" in value) {
                    return value as DumpHeader;
                  }
                  return Promise.reject("Headers must be first input");
                })
                .finally(() => {
                  ready.cancel();
                });
            })
            .then((header) => {
              return (
                new PouchDB("gwapo-db", {
                  adapter: "indexeddb",
                }).get(
                  toDumpDatabaseName(header)
                ) as Promise<DumpHeaderDocument>
              ).catch(
                // document may not exist, OR ignore the error
                () =>
                  ({
                    ...header,
                    _id: toDumpDatabaseName(header),
                    $id: "dump",
                    seq: 0,
                  } as DumpHeaderDocument)
              );
            })
            .then((dumpHeaderDocument) => ({
              data: {
                ...dumpHeaderDocument,
                seq: dumpHeaderDocument?.seq ?? 0,
              },
              error: undefined,
            }));
        },
      }),
    };
  },
});

export const readGwapoDatabases = injectedApi.endpoints.readGwapoDatabases;

export const selectProgress = createSelector(
  readGwapoDatabases.select({}),
  (queryResult) => {
    if (!queryResult.data) return -1;
    return Math.round(
      (queryResult.data.seq / queryResult.data.db_info.doc_count) * 100
    );
  }
);
