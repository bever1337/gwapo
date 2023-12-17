import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";

import { Scope } from "../../types/token";

interface ReadAccountWalletArguments {}

export interface AccountCurrency {
  id: number;
  value: number;
}

type ReadAccountWalletResult = EntityState<AccountCurrency, number>;

const scopes = [Scope.Account, Scope.Wallet];

const accountCurrenciesEntityAdapter = createEntityAdapter<AccountCurrency>();
export const initialState = accountCurrenciesEntityAdapter.getInitialState();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountWallet: build.query<ReadAccountWalletResult, ReadAccountWalletArguments>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags(result, error, queryArguments, meta) {
          const tags = [{ type: "access_token" as const, id: "LIST" }];
          if (meta?.access_token) {
            tags.push({ type: "access_token", id: meta.access_token });
          }
          return tags;
        },
        query() {
          return {
            url: "/v2/account/wallet",
            validateStatus(response, body) {
              return response.status === 200 && Array.isArray(body);
            },
          };
        },
        transformResponse(response: AccountCurrency[]) {
          return accountCurrenciesEntityAdapter.setAll(initialState, response);
        },
      }),
    };
  },
});

export const readAccountWallet = injectedApi.endpoints.readAccountWallet;
