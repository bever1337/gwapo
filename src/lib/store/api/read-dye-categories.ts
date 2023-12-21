import { api } from ".";
import { selectGwapoEdgeUrl } from "./selectors";

export type ReadDyeCategoriesArguments = Record<string, never>;

export interface ReadDyeCategoriesResult {
  hue: string[];
  material: string[];
  rarity: string[];
}

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readDyeCategories: build.query<ReadDyeCategoriesResult, ReadDyeCategoriesArguments>({
        extraOptions: { baseUrl: selectGwapoEdgeUrl },
        query() {
          return { url: "/api/dyes/categories" };
        },
      }),
    };
  },
});

export const readDyeCategories = injectedApi.endpoints.readDyeCategories;

export const initialState: ReadDyeCategoriesResult = {
  hue: [],
  material: [],
  rarity: [],
};
