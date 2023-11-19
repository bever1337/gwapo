import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import { createSvelteApi } from "$lib/svelte-redux/query";

import type { ReadTokenInfoArguments, ReadTokenInfoResult } from "./read-token-info";
import { hydrate } from "./slice";

import type { RootState } from "../reducer";

import type { Scope } from "../../types/token";

interface BaseQueryExtraOptions {
  baseUrl?: `https://${string}`;
  scope?: Scope[];
}

const rawBaseQuery = fetchBaseQuery({});

const baseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions,
  { access_token: null | string } & FetchBaseQueryMeta
> = async function baseQuery(args, queryApi, extraOptions) {
  const nextArguments = { ...args };
  const meta: { access_token: null | string } = { access_token: null };
  if (extraOptions.baseUrl) {
    nextArguments.url = `${extraOptions.baseUrl}${args.url}`;
  }

  if (Array.isArray(extraOptions.scope) && extraOptions.scope.length > 0) {
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

  const baseResult = await rawBaseQuery(nextArguments, queryApi, extraOptions);

  return {
    ...baseResult,
    meta: baseResult.meta && {
      ...baseResult.meta,
      ...meta,
    },
  };
};

export const api = createSvelteApi({
  baseQuery,
  endpoints(build) {
    return {
      readTokenInfo: build.query<ReadTokenInfoResult, ReadTokenInfoArguments>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
        },
        providesTags(result, error, queryArguments, meta) {
          const tags = [{ type: "access_token" as const, id: "LIST" }];
          if (meta?.access_token) {
            tags.push({ type: "access_token", id: meta.access_token });
          }
          return tags;
        },
        query({ access_token }) {
          return {
            params: { access_token, v: "2019-05-22T00:00:00.000Z" },
            url: "/v2/tokeninfo",
            validateStatus(response, body) {
              return response.status === 200 && access_token.startsWith(body.id);
            },
          };
        },
      }),
    };
  },
  extractRehydrationInfo(action) {
    if (hydrate.match(action)) {
      return action.payload;
    }
    return undefined;
  },
  reducerPath: "cache",
  tagTypes: [
    // Internal
    "internal/pouches",
    // Gw2
    "access_token",
    "characters",
  ],
});
