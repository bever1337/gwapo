import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

export const skinTypesAdapter = createEntityAdapter<{
  id: string;
  subtypes: string[];
}>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readSkinTypes: build.query<
        EntityState<{
          id: string;
          subtypes: string[];
        }>,
        {}
      >({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_skins/types_with_detail",
                { group: true }
              )
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse.rows.reduce(
                  (acc, row) =>
                    skinTypesAdapter.setOne(acc, {
                      id: row.key as string,
                      subtypes: row.value,
                    }),
                  skinTypesAdapter.getInitialState()
                ),
                error: undefined,
              };
            })
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const readSkinTypes = injectedApi.endpoints.readSkinTypes;
