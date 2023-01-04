import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

type SkinType = {
  id: string;
  ids: string[];
} & { [key: string]: string[] };

export const skinTypesAdapter = createEntityAdapter<SkinType>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readSkinTypes: build.query<EntityState<SkinType>, {}>({
        providesTags() {
          return [{ type: "internal/pouches", id: "BEST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).allDocs({
                include_docs: true,
                startkey: "skins",
                endkey: "skins_\ufff0",
              })
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse.rows.reduce(
                  (acc, row) =>
                    skinTypesAdapter.setOne(acc, row.doc! as any as SkinType),
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
