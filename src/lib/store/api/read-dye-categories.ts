import { api } from ".";

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
        queryFn() {
          return { error: { error: "Unimplemented", status: "CUSTOM_ERROR" } };
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
