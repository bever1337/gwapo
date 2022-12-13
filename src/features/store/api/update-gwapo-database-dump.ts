import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import { api } from ".";

import { DumpToPouchSink } from "../../streams/DumpToPouch";
import { DumpStreamActions } from "../../streams/DumpToPouch/actions";
import { NewlineDelimitedJsonTransformer } from "../../streams/NewlineDelimitedJson";

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
        queryFn(
          queryArguments: UpdateGwapoDatabaseDumpArguments,
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

export const updateGwapoDatabaseDump =
  injectedApi.endpoints.updateGwapoDatabaseDump;
