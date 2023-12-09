import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";

export enum CurrencyCategory {
  General,
  Competitive,
  Map,
  Keys,
  Dungeon,
  BlackLion,
}

export interface Currency {
  categories: CurrencyCategory[];
  id: number;
  deprecated: boolean;
  description: string;
  icon: string;
  name: string;
  order: number;
}

export interface ReadCurrenciesArguments {
  langTag: string;
}

export type ReadCurrenciesResult = EntityState<Currency, number>;

export const currenciesEntityAdapter = createEntityAdapter<Currency>({
  sortComparer(a, b) {
    return a.order - b.order;
  },
});

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCurrencies: build.query<ReadCurrenciesResult, ReadCurrenciesArguments>({
        queryFn() {
          return { error: { error: "Unimplemented", status: "CUSTOM_ERROR" } };
        },
      }),
    };
  },
});

export const readCurrencies = injectedApi.endpoints.readCurrencies;
