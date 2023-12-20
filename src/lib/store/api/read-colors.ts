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
  /** named_color language tag */
  langTag: string;
  /** detailed_color material */
  material: string;
  /** Dye categories */
  where: [hue: null | string, material: null | string, rarity: null | string];
}

export type ReadColorsResult = EntityState<Color, number>;

export const colorsEntityAdapter = createEntityAdapter<Color>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readColors: build.query<ReadColorsResult, ReadColorsArguments>({
        query({ langTag, material, where: [where_hue, where_material, where_rarity] }) {
          return {
            params: {
              langTag,
              material,
              where_hue: where_hue ?? "",
              where_material: where_material ?? "",
              where_rarity: where_rarity ?? "",
            },
            url: "/api/dyes",
          };
        },
      }),
    };
  },
});

export const readColors = injectedApi.endpoints.readColors;
