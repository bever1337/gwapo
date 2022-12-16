import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

type SkinType = {
  id: string;
  ids: string[];
} & { [key: string]: string[] };

export const skinTypesAdapter = createEntityAdapter<SkinType>();
const selectors = skinTypesAdapter.getSelectors();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readSkinTypes: build.query<EntityState<SkinType>, {}>({
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
                  (acc, { key: [primary, secondary], value }) => {
                    const previousState: SkinType = selectors.selectById(
                      acc,
                      primary
                    ) ?? { id: primary, ids: [] };
                    const nextState = {
                      ...previousState,
                    } as SkinType;
                    if (secondary) {
                      nextState.ids = previousState.ids.concat([secondary]);
                      nextState[secondary] = value;
                    }
                    return skinTypesAdapter.upsertOne(acc, nextState);
                  },
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
