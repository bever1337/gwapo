import { createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';

import { api } from '.';

import { getPouch } from '../../pouch';

import type { Item } from '../../types/item';

export interface ReadItemsArguments {
	/** Unique item identifiers */
	ids: number[];
}

export type ReadItemsResult = EntityState<Item, number>;

const itemsEntityAdapter = createEntityAdapter<Item>();
const initialState = itemsEntityAdapter.getInitialState();

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readItems: build.query<ReadItemsResult, ReadItemsArguments>({
				providesTags() {
					return [
						{ type: 'internal/pouches', id: 'LIST' },
						{ type: 'internal/pouches', id: 'items' }
					];
				},
				async queryFn({ ids }) {
					return getPouch()
						.allDocs({
							keys: ids.map((itemId) => `items_${itemId}`),
							include_docs: true
						})
						.then((allDocsResponse) => {
							const entityState = itemsEntityAdapter.setAll(
								initialState,
								allDocsResponse.rows.reduce(
									(accumulateDocs, row) =>
										'doc' in row
											? accumulateDocs.concat([row.doc as unknown as Item])
											: accumulateDocs,
									[] as Item[]
								)
							);
							return {
								data: entityState,
								error: undefined
							};
						})
						.catch((reason) => ({ data: undefined, error: reason }));
				}
			})
		};
	}
});

export const readItems = injectedApi.endpoints.readItems;
