import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { makeSelectIsInScope } from "./selectors";

import { Scope } from "../../types/token";

interface ReadAccountMaterialsArguments {}

export interface AccountMaterial {
  id: number;
  binding?: "Acccount";
  category: number;
  count: number;
}

type ReadAccountMaterialsResult = EntityState<AccountMaterial, number>;

const accountMaterialAdapter = createEntityAdapter<AccountMaterial>();

const scopes = [Scope.Account, Scope.Inventories];

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountMaterials: build.query<ReadAccountMaterialsResult, ReadAccountMaterialsArguments>({
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
            url: "/v2/account/materials",
            validateStatus(response, body) {
              return response.status === 200 && Array.isArray(body);
            },
          };
        },
        transformResponse(response: AccountMaterial[]) {
          return accountMaterialAdapter.setAll(accountMaterialAdapter.getInitialState(), response);
        },
      }),
    };
  },
});

export const readAccountMaterials = injectedApi.endpoints.readAccountMaterials;
export const selectReadAccountMaterialsInScope = makeSelectIsInScope(scopes);
