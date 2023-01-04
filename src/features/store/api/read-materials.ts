import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { getDatabaseName } from "./read-gwapo-databases";

import { api } from ".";

import { PouchDB } from "../../pouch";

export interface Materials {
  id: number;
  items: number[];
  name: string;
  order: number;
}

export interface ReadMaterialsArguments {}

export type ReadMaterialsResult = EntityState<Materials>;

const materialsEntityAdapter = createEntityAdapter<Materials>({
  sortComparer(a, b) {
    return a.order - b.order;
  },
});
const initialState = materialsEntityAdapter.getInitialState();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readMaterials: build.query<ReadMaterialsResult, ReadMaterialsArguments>({
        providesTags() {
          return [{ type: "internal/pouches", id: "BEST" }];
        },
        queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).allDocs({
                include_docs: true,
                startkey: "materials_0",
                endkey: "materials_\ufff0",
              })
            )
            .then((response) => {
              const reducedData = materialsEntityAdapter.setAll(
                initialState,
                response.rows.map((row) => row.doc) as unknown[] as Materials[]
              );
              if (reducedData.ids.length === 0) {
                return Promise.reject("Bad query");
              }
              return {
                data: materialsEntityAdapter.setAll(
                  initialState,
                  response.rows.map(
                    (row) => row.doc
                  ) as unknown[] as Materials[]
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

export const readMaterials = injectedApi.endpoints.readMaterials;
