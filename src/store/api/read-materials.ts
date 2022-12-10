import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from "../api";

import { PouchDB } from "../../features/pouch";

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
        queryFn() {
          const pouch = new PouchDB("gwapo-db");
          return pouch
            .find({
              selector: {
                $id: { $eq: "gwapo/materials" },
              },
              fields: ["id", "items", "name", "order"],
            })
            .then(({ docs }) => {
              return {
                data: materialsEntityAdapter.setAll(
                  initialState,
                  docs as unknown[] as Materials[]
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
