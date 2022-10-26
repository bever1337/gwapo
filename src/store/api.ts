import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

interface BaseQueryExtraOptions {
  baseUrl?: `https://${string}`;
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
  return rawBaseQuery(
    { ...args, url: `${extraOptions.baseUrl!}${args.url}` },
    queryApi,
    extraOptions
  );
};

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: "cache",
  tagTypes: [],
});
