import { getDatabaseName } from "./read-gwapo-databases";

import { api } from ".";

import { PouchDB } from "../../pouch";

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readArmorWeightClasses: build.query<string[], {}>({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_skins/armor_weight_classes",
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

export const readArmorWeightClasses =
  injectedApi.endpoints.readArmorWeightClasses;
