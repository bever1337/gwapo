import { api } from '.';
import { makeSelectIsInScope } from '../selectors';

import { Scope } from '../../types/token';

export interface ReadCharactersInventoryArguments {
	characterName: string;
}

export interface BagInventory {
	/** The item id which can be resolved against /v2/items */
	id: number;
	/** describes which kind of binding the item has. Possible values: */
	binding?: 'Character' | 'Account';
	/** Name of the character the item is bound to. Only if `binding` is `"Character" */
	bound_to?: string;
	/** The number of charges on an item. */
	charges?: number;
	/** Amount of item in the stack. Minium of 1, maximum of 250. */
	count: number;
	/** Array of selected dyes for the equipment piece. Values default to null if no dye is selected. Colors can be resolved against v2/colors */
	dyes?: number[];
	/** returns an array of infusion item ids which can be resolved against /v2/items */
	infusions?: number[];
	/** Skin id for the given equipment piece. Can be resolved against /v2/skins */
	skin?: number;
	/** Contains information on the stats chosen if the item offers an option for stats/prefix. */
	stats?: {
		/** The itemstat id, can be resolved against /v2/itemstats. */
		id: number;
		/** Contains a summary of the stats on the item. */
		attributes: {
			/** Shows the amount of power given */
			Power?: number;
			/** Shows the amount of Precision given */
			Precision?: number;
			/** Shows the amount of Toughness given */
			Toughness?: number;
			/** Shows the amount of Vitality given */
			Vitality?: number;
			/** Shows the amount of Condition Damage given */
			ConditionDamage?: number;
			/** Shows the amount of Condition Duration given */
			ConditionDuration?: number;
			/** Shows the amount of Healing Power given */
			Healing?: number;
			/** Shows the amount of Boon Duration given */
			BoonDuration?: number;
		};
	};
	/** returns an array of upgrade component item ids which can be resolved against /v2/items */
	upgrades?: number[];
}

export interface Bag {
	/** The bag's item id which can be resolved against /v2/items */
	id: number;
	/** The amount of slots available with this bag. */
	size: number;
	/** Contains one object structure per item, object is null if no item is in the given bag slot. */
	inventory: (BagInventory | null)[];
}

export type ReadCharactersInventoryResult = (Bag | null)[];

const scopes = [Scope.Account, Scope.Characters];
const scopeTags = [{ type: 'access_token' as const, id: 'LIST' }].concat(
	scopes.map((scope) => ({
		type: 'access_token' as const,
		id: scope
	}))
);

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readCharactersInventory: build.query<
				ReadCharactersInventoryResult,
				ReadCharactersInventoryArguments
			>({
				extraOptions: {
					baseUrl: 'https://api.guildwars2.com',
					scope: scopes
				},
				providesTags(result, error, queryArguments) {
					const defaultTags = [{ id: 'LIST', type: 'characters' as const }, ...scopeTags];
					if (result && !error) {
						defaultTags.push({
							id: queryArguments.characterName,
							type: 'characters'
						});
					}
					return defaultTags;
				},
				query(queryArguments) {
					return {
						url: `/v2/characters/${encodeURI(queryArguments.characterName)}/inventory`,
						validateStatus(response, body) {
							return response.status === 200 && Array.isArray(body.bags) && body.bags.length > 0;
						}
					};
				},
				transformResponse(response: { bags: ReadCharactersInventoryResult }) {
					return response.bags;
				}
			})
		};
	}
});

export const readCharactersInventory = injectedApi.endpoints.readCharactersInventory;
export const selectReadCharactersInScope = makeSelectIsInScope(scopes);
