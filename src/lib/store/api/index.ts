import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import { createSvelteApi } from "$lib/svelte-redux/query";

import { hydrate } from "./slice";

import type { RootState } from "../reducer";

import type { Scope } from "../../types/token";

interface BaseQueryExtraOptions {
  baseUrl?: `https://${string}`;
  scope?: Scope[];
}

export type ApiMeta =
  | { access_token: null | string }
  | (FetchBaseQueryMeta & { access_token: null | string });

export const baseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions,
  ApiMeta
> = async function baseQuery(args, queryApi, extraOptions) {
  const nextArguments = { ...args };
  if ("params" in nextArguments) {
    nextArguments.params = { ...nextArguments.params };
  }

  const meta: { access_token: null | string } = { access_token: null };

  if (extraOptions?.baseUrl) {
    nextArguments.url = `${extraOptions.baseUrl}${args.url}`;
  }

  if (Array.isArray(extraOptions?.scope) && extraOptions.scope.length > 0) {
    // request is Gw2 authenticated api
    const { access_token } = (queryApi.getState() as RootState).client;
    if (!access_token) {
      return {
        data: undefined,
        // schema matches GW2 401 responses
        error: {
          status: 401,
          data: { text: "Internal - Invalid access token" },
        },
      };
    }
    meta.access_token = access_token;
    nextArguments.params ??= {};
    nextArguments.params["access_token"] = access_token;
  }

  const rawBaseQuery = fetchBaseQuery(
    typeof queryApi.extra === "object" &&
      queryApi.extra !== null &&
      "fetchFn" in queryApi.extra &&
      typeof queryApi.extra.fetchFn === "function"
      ? { fetchFn: queryApi.extra.fetchFn as typeof fetch }
      : {}
  );

  const baseResult = await rawBaseQuery(nextArguments, queryApi, extraOptions);

  return {
    ...baseResult,
    meta: baseResult.meta
      ? {
          ...baseResult.meta,
          ...meta,
        }
      : meta,
  };
};

export const api = createSvelteApi({
  baseQuery,
  endpoints() {
    return {};
  },
  extractRehydrationInfo(action) {
    if (hydrate.match(action)) {
      return action.payload;
    }
    return undefined;
  },
  reducerPath: "cache",
  tagTypes: [
    // Gw2
    "access_token",
    "characters",
  ],
});
