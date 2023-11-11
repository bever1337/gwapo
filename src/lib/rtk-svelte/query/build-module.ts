/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
	Api,
	BaseQueryFn,
	EndpointDefinition,
	EndpointDefinitions,
	Module,
	MutationDefinition,
	QueryDefinition
} from '@reduxjs/toolkit/query';

import type { QueryStores, MutationStore } from './build-stores';
import { buildStores } from './build-stores';

export const svelteStoresModuleName = /* @__PURE__ */ Symbol();
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

enum DefinitionType {
	query = 'query',
	mutation = 'mutation'
}

export function isQueryDefinition(
	e: EndpointDefinition<any, any, any, any>
): e is QueryDefinition<any, any, any, any> {
	return e.type === DefinitionType.query;
}

export function isMutationDefinition(
	e: EndpointDefinition<any, any, any, any>
): e is MutationDefinition<any, any, any, any> {
	return e.type === DefinitionType.mutation;
}

export const buildSvelteModule = (): Module<SvelteStoresModule> => ({
	name: svelteStoresModuleName,
	init(api, { serializeQueryArgs }, context) {
		const anyApi = api as any as Api<any, Record<string, any>, string, string, SvelteStoresModule>;

		const { buildQueryStores, buildMutationStore } = buildStores({
			api,
			serializeQueryArgs,
			context
		});

		return {
			injectEndpoint(endpointName, definition) {
				if (isQueryDefinition(definition)) {
					const queryStores = buildQueryStores(endpointName);
					Object.assign(anyApi.endpoints[endpointName], queryStores);
				} else if (isMutationDefinition(definition)) {
					const mutationStore = buildMutationStore(endpointName);
					Object.assign(anyApi.endpoints[endpointName], mutationStore);
				}
			}
		};
	}
});
