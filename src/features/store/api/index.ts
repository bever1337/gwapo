import { createSelector } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import type { Scope } from "../../../types/token";

import type { RootState } from "..";

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

const selectInScope = createSelector(
  (state: RootState) => state?.client ?? {},
  (substate: RootState, scopes: Scope[]) => scopes,
  (substate, scopes) => {
    if (scopes.length === 0) {
      // public api
      return true;
    }
    return scopes.every(
      (scope) => substate.access?.permissions.includes(scope) ?? false
    );
  }
);

function baseQuery(
  args: FetchArgs,
  queryApi: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions
) {
  const nextArguments = { ...args };
  if (extraOptions.baseUrl) {
    nextArguments.url = `${extraOptions.baseUrl}${args.url}`;
  }
  if (Array.isArray(extraOptions.scope)) {
    // request is Gw2 authenticated api
    const queryIsInScope = selectInScope(
      queryApi.getState() as RootState,
      extraOptions.scope
    );
    const access_token = (queryApi.getState() as RootState).client.access
      ?.access_token;
    if (!queryIsInScope || !access_token) {
      return {
        data: undefined,
        // schema matches GW2 401 responses
        error: {
          status: 401,
          data: { text: "Internal - Invalid access token" },
        },
      };
    }
    nextArguments.params ??= {};
    nextArguments.params.access_token = access_token;
  }
  return rawBaseQuery(nextArguments, queryApi, extraOptions);
}

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
