import { getDatabaseName } from "./read-gwapo-databases";

import { api } from ".";

import { PouchDB } from "../../pouch";

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readArmorSkins: build.query<
        any,
        {
          type: string;
          weight_class: string;
        }
      >({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_skins/armor_by_type_and_weight",
                {
                  include_docs: true,
                  key: `${queryArguments.type}_${queryArguments.weight_class}`,
                }
              )
            )
            .then((allDocsResponse) => {
              // todo, entity adapter
              return {
                data: allDocsResponse.rows.map((row) => row.doc),
                error: undefined,
              };
            })
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const readArmorSkins = injectedApi.endpoints.readArmorSkins;
