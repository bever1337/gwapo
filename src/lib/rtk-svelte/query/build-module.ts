/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
	Api,
	BaseQueryFn,
	EndpointDefinitions,
	Module,
	MutationDefinition,
	QueryDefinition
} from '@reduxjs/toolkit/query';

import type { QueryStores, MutationStore } from './build-stores';
import { buildStores } from './build-stores';

import { svelteReduxContextKey } from '..';
import type { SvelteReduxContextKey } from '..';

export const svelteStoresModuleName = Symbol();
export type SvelteStoresModule = typeof svelteStoresModuleName;

declare module '@reduxjs/toolkit/dist/query/apiTypes' {
	export interface ApiModules<
		BaseQuery extends BaseQueryFn,
		Definitions extends EndpointDefinitions,
		ReducerPath extends string,
		TagTypes extends string
	> {
		[svelteStoresModuleName]: {
			endpoints: {
				[K in keyof Definitions]: Definitions[K] extends QueryDefinition<any, any, any, any, any>
					? QueryStores<Definitions[K]>
					: Definitions[K] extends MutationDefinition<any, any, any, any, any>
					? MutationStore<Definitions[K]>
					: never;
			};
		};
	}
}

export const buildSvelteModule = (
	contextKey = svelteReduxContextKey
): Module<SvelteStoresModule> => ({
	name: svelteStoresModuleName,
	init(api, { serializeQueryArgs }, context) {
		const anyApi = api as any as Api<any, Record<string, any>, string, string, SvelteStoresModule>;

		const { buildQueryStores, buildMutationStore } = buildStores(
			api,
			{ serializeQueryArgs },
			context,
			contextKey
		);

		return {
			injectEndpoint(endpointName, definition) {
				if (definition.type === 'query') {
					const queryStores = buildQueryStores(endpointName);
					Object.assign(anyApi.endpoints[endpointName], queryStores);
				} else if (definition.type === 'mutation') {
					const mutationStore = buildMutationStore(endpointName);
					Object.assign(anyApi.endpoints[endpointName], mutationStore);
				}
			}
		};
	}
});
