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

export interface SkinDocument {
  $id: "gwapo/skin";
  _id: `skin_${string}`;
  _rev: string;
}

export const skinAdapter = createEntityAdapter<Skin & SkinDocument>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readSkins: build.query<
        EntityState<Skin & SkinDocument>,
        { type: string } | { key: string }
      >({
        providesTags() {
          return [{ type: "internal/pouches", id: "BEST" }];
        },
        queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then(function queryPouchForSkins(databaseName) {
              const pouch = new PouchDB(databaseName, {
                adapter: "indexeddb",
              });
              if ("type" in queryArguments) {
                return pouch.allDocs({
                  endkey: `skin_${queryArguments.type}_\ufff0`,
                  include_docs: true,
                  startkey: `skin_${queryArguments.type}_0`,
                });
              }
              return pouch.allDocs({
                key: queryArguments.key,
                include_docs: true,
              });
            })
            .then(function reduceRowsIntoEntities(allDocsResponse) {
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
