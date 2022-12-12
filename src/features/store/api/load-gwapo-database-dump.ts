import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import { api } from "../api";

import { DumpToPouchSink } from "../../streams/DumpToPouch";
import { DumpStreamActions } from "../../streams/DumpToPouch/actions";
import { NewlineDelimitedJsonTransformer } from "../../streams/NewlineDelimitedJson";

export interface LoadGwapoDatabaseDumpArguments {}

export type LoadGwapoDatabaseResult = null;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      loadGwapoDatabaseDump: build.mutation<
        LoadGwapoDatabaseResult,
        LoadGwapoDatabaseDumpArguments
      >({
        invalidatesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        queryFn(
          queryArguments: LoadGwapoDatabaseDumpArguments,
          queryApi: BaseQueryApi
        ) {
          return fetch(`${process.env.PUBLIC_URL}/dump.txt`, {
            signal: queryApi.signal,
          })
            .then((response) => {
              if (!response.body) {
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
                );
            })
            .then(() => {
              return { data: null, error: undefined };
            })
            .catch((reason) => {
              return { data: undefined, error: reason.toString() };
            });
        },
      }),
    };
  },
});

export const loadGwapoDatabaseDump =
  injectedApi.endpoints.loadGwapoDatabaseDump;
