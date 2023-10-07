import { api } from '.';
import { makeSelectIsInScope } from '../selectors';

import { Scope } from '../../types/token';

interface ReadAccountInventoryArguments {}

export interface SharedInventorySlot {
	/** The item's ID. */
	id: number;
	/** The current binding of the item. If present, the only possible value is Account. */
	binding?: string;
	/** The amount of charges remaining on the item. */
	charges?: number;
	/** The amount of items in the item stack. */
	count: number;
	/** An array of item IDs for each infusion applied to the item. */
	infusions?: number[];
	/** The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins. */
	skin?: number;
	/** An array of item IDs for each rune or signet applied to the item. */
	upgrades?: number[];
}

type ReadAccountInventoryResult = SharedInventorySlot[];

const scopes = [Scope.Account, Scope.Inventories];
const scopeTags = [{ type: 'access_token' as const, id: 'LIST' }].concat(
	scopes.map((scope) => ({
		type: 'access_token' as const,
		id: scope
	}))
);

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readAccountInventory: build.query<ReadAccountInventoryResult, ReadAccountInventoryArguments>({
				extraOptions: {
					baseUrl: 'https://api.guildwars2.com',
					scope: scopes
				},
				query() {
					return {
						url: '/v2/account/inventory',
						validateStatus(response, body) {
							return response.status === 200 && Array.isArray(body) && body.length > 0;
						}
					};
				},
				providesTags() {
					return scopeTags;
				}
			})
		};
	}
});

export const readAccountInventory = injectedApi.endpoints.readAccountInventory;
export const selectReadAccountInventoryInScope = makeSelectIsInScope(scopes);
