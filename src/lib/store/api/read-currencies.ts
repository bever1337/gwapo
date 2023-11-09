import { createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';

import { api } from '.';

import { getPouch } from '../../pouch';

export enum CurrencyCategory {
	General,
	Competitive,
	Map,
	Keys,
	Dungeon,
	BlackLion
}

export interface Currency {
	categories: CurrencyCategory[];
	id: number;
	deprecated?: true;
	description: string;
	icon: string;
	name: string;
	order: number;
}

export interface ReadCurrenciesArguments {}

export type ReadCurrenciesResult = EntityState<Currency, number>;

const currenciesEntityAdapter = createEntityAdapter<Currency>({
	sortComparer(a, b) {
		return a.order - b.order;
	}
});
export const initialState = currenciesEntityAdapter.getInitialState();

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readCurrencies: build.query<ReadCurrenciesResult, ReadCurrenciesArguments>({
				providesTags() {
					return [
						{ type: 'internal/pouches', id: 'LIST' },
						{ type: 'internal/pouches', id: 'currencies' }
					];
				},
				queryFn() {
					return getPouch()
						.allDocs({
							include_docs: true,
							startkey: 'currencies_0',
							endkey: 'currencies_\ufff0'
						})
						.then((response) => ({
							data: currenciesEntityAdapter.setAll(
								initialState,
								response.rows.map((row) => row.doc) as unknown[] as Currency[]
							),
							error: undefined
						}))
						.catch((reason) => ({ data: undefined, error: reason?.toString?.() ?? `${reason}` }));
				}
			})
		};
	}
});

export const readCurrencies = injectedApi.endpoints.readCurrencies;
