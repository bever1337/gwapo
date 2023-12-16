import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";

export interface Color {
  id: number;
  blue: number;
  green: number;
  name: string;
  red: number;
  rgb: string;
}

export interface ReadColorsArguments {
  langTag: string;
  material: string;
}

export type ReadColorsResult = EntityState<Color, number>;

export const colorsEntityAdapter = createEntityAdapter<Color>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readColors: build.query<ReadColorsResult, ReadColorsArguments>({
        queryFn() {
          return { error: { error: "Unimplemented", status: "CUSTOM_ERROR" } };
        },
      }),
    };
  },
});

export const readColors = injectedApi.endpoints.readColors;
