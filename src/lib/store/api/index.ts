import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import { createSvelteApi } from "$lib/svelte-redux/query";

import type { ReadTokenInfoArguments, ReadTokenInfoResult } from "./read-token-info";
import type { Scope } from "../../types/token";

import type { RootState } from "../";
import { hydrate } from "../actions";

/**
 * It's kind of tedious to re-type a reusable queryfn
 * gw2 api logic should be a separate base query fn that uses fetchbasequery fn internally
 * TODO messy
 */

interface BaseQueryExtraOptions {
  baseUrl?: `https://${string}`;
  scope?: Scope[];
}

const rawBaseQuery = fetchBaseQuery();

export const getIsAuthorized = (permissions: Scope[], scopes: Scope[]) => {
  const isPublicApi = scopes.length === 0;
  if (isPublicApi) {
    return true;
  }

  const isAuthorized =
    permissions.length >= 1 && scopes.every((scope) => permissions.includes(scope));
  return isAuthorized;
};

const noTokenResult = {
  data: undefined,
  // schema matches GW2 401 responses
  error: {
    status: 401,
    data: { text: "Internal - Invalid access token" },
  },
};

export const api = createSvelteApi({
  async baseQuery(args: FetchArgs, queryApi: BaseQueryApi, extraOptions: BaseQueryExtraOptions) {
    const nextArguments = { ...args };
    if (extraOptions.baseUrl) {
      nextArguments.url = `${extraOptions.baseUrl}${args.url}`;
    }
    if (Array.isArray(extraOptions.scope) && extraOptions.scope.length > 0) {
      // request is Gw2 authenticated api
      const { access_token } = (queryApi.getState() as RootState).client;
      if (!access_token) {
        return noTokenResult;
      }
      const { permissions } = await queryApi
        .dispatch(api.endpoints.readTokenInfo.initiate({ access_token }))
        .unwrap();
      const queryIsInScope = getIsAuthorized(permissions, extraOptions.scope);
      if (!queryIsInScope) {
        return noTokenResult;
      }
      nextArguments.params ??= {};
      nextArguments.params["access_token"] = access_token;
    }
    return rawBaseQuery(nextArguments, queryApi, extraOptions);
  },
  endpoints(build) {
    return {
      readTokenInfo: build.query<ReadTokenInfoResult, ReadTokenInfoArguments>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
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
