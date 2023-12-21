import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { selectGwapoEdgeUrl } from "./selectors";

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
        extraOptions: {
          baseUrl: selectGwapoEdgeUrl,
        },
        query({ langTag }) {
          return {
            params: {
              langTag,
            },
            url: "/api/currencies",
          };
        },
      }),
    };
  },
});

export const readCurrencies = injectedApi.endpoints.readCurrencies;
