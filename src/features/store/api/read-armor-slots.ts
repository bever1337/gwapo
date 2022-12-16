import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

export interface ArmorSkin {
  description?: string;
  details: {
    dye_slots: {}[];
    type:
      | "Boots"
      | "Coat"
      | "Gloves"
      | "Helm"
      | "HelmAquatic"
      | "Leggings"
      | "Shoulders";
    weight_class: "Clothing" | "Heavy" | "Light" | "Medium";
  };
  flags: ("ShowInWardrobe" | "NoCost" | "HideIfLocked" | "OverrideRarity")[];
  icon: string;
  id: number;
  name: string;
  rarity: string;
  restrictions: string[];
  type: "Armor";
}

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readArmorSlots: build.query<string[], {}>({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_skins/armor_slots",
                { group: true }
              )
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse.rows.map((row) => row.key),
                error: undefined,
              };
            })
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const readArmorSlots = injectedApi.endpoints.readArmorSlots;
