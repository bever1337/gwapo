import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

export interface Skin {
  description?: string;
  details?: any;
  flags: ("ShowInWardrobe" | "NoCost" | "HideIfLocked" | "OverrideRarity")[];
  icon: string;
  id: number;
  name: string;
  rarity: string;
  restrictions: string[];
  type: "Armor";
}

export const skinAdapter = createEntityAdapter<Skin>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readSkins: build.query<EntityState<Skin>, { type: string }>({
        providesTags() {
          return [{ type: "internal/pouches", id: "BEST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_skins/detailed_type",
                { key: queryArguments.type, include_docs: true }
              )
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse.rows.reduce(
                  (acc, row) => skinAdapter.setOne(acc, row.doc as any),
                  skinAdapter.getInitialState()
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

export const readSkins = injectedApi.endpoints.readSkins;
