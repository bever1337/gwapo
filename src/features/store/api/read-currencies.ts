import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { getDatabaseName } from "./read-gwapo-databases";

import { api } from ".";

import { PouchDB } from "../../pouch";

export interface Currency {
  id: number;
  description: string;
  icon: string;
  name: string;
  order: number;
}

export interface ReadCurrenciesArguments {}

export type ReadCurrenciesResult = EntityState<Currency>;

const currenciesEntityAdapter = createEntityAdapter<Currency>({
  sortComparer(a, b) {
    return a.order - b.order;
  },
});
export const initialState = currenciesEntityAdapter.getInitialState();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCurrencies: build.query<
        ReadCurrenciesResult,
        ReadCurrenciesArguments
      >({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).allDocs({
                include_docs: true,
                startkey: "currencies_0",
                endkey: "currencies_\ufff0",
              })
            )
            .then((response) => ({
              data: currenciesEntityAdapter.setAll(
                initialState,
                response.rows.map((row) => row.doc) as unknown[] as Currency[]
              ),
              error: undefined,
            }))
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const readCurrencies = injectedApi.endpoints.readCurrencies;
