import { createSelector } from "@reduxjs/toolkit";

import { api } from ".";
import { makeSelectIsInScope } from "../selectors";

import { Scope } from "../../../types/token";

interface ReadAccountMaterialsArguments {}

export interface AccountMaterial {
  id: number;
  binding?: "Acccount";
  category: number;
  count: number;
}

type ReadAccountMaterialsResult = AccountMaterial[];

const scopes = [Scope.Account, Scope.Inventories];
const scopeTags = scopes
  .map((scope) => ({
    type: "access_token" as const,
    id: scope as any,
  }))
  .concat([{ type: "access_token" as const, id: "LIST" }]);

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountMaterials: build.query<
        ReadAccountMaterialsResult,
        ReadAccountMaterialsArguments
      >({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        query() {
          return {
            url: "/v2/account/materials",
            validateStatus(response, body) {
              return response.status === 200 && Array.isArray(body);
            },
          };
        },
        providesTags(result, error, queryArguments) {
          return scopeTags;
        },
      }),
    };
  },
});

export const readAccountMaterials = injectedApi.endpoints.readAccountMaterials;
export const selectReadAccountMaterialsInScope = makeSelectIsInScope(scopes);
// An entity adapter would make this data jive with `read-materials`
export const selectAccountMaterialsByCategory = createSelector(
  readAccountMaterials.select({}),
  (queryResult) =>
    (queryResult?.data ?? []).reduce(
      (acc, accountMaterial) => ({
        ...acc,
        [accountMaterial.category]: {
          ...(acc[accountMaterial.category] ?? {}),
          [accountMaterial.id]: accountMaterial,
        },
      }),
      {} as { [index: number]: { [index: number]: AccountMaterial } }
    )
);
