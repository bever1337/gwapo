import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import type { Scope } from "../../../types/token";

import type { RootState } from "..";

interface BaseQueryExtraOptions {
  baseUrl?: `https://${string}`;
  scope?: Scope[];
}

const rawBaseQuery = fetchBaseQuery();

const baseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions,
  {}
> = function baseQuery(
  args: FetchArgs,
  queryApi: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions
) {
  const nextArguments = { ...args };
  if (extraOptions.baseUrl) {
    nextArguments.url = `${extraOptions.baseUrl}${args.url}`;
  }
  if (Array.isArray(extraOptions.scope)) {
    nextArguments.params ??= {};
    nextArguments.params.access_token = (
      queryApi.getState() as RootState
    ).client.access?.id;
  }
  return rawBaseQuery(nextArguments, queryApi, extraOptions);
};

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: "cache",
  tagTypes: [
    // Internal
    "internal/pouches",
    // Gw2
    "access_token",
    "characters",
  ],
});
