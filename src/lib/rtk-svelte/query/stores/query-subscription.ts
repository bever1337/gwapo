/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { skipToken } from '@reduxjs/toolkit/query';
import type {
	Api,
	ApiContext,
	ApiEndpointQuery,
	CoreModule,
	EndpointDefinitions,
	QueryArgFrom,
	QueryDefinition,
	SerializeQueryArgs,
	SkipToken
} from '@reduxjs/toolkit/query';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { derived } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { getSvelteReduxContext } from '../..';

export interface QuerySubscriptionTopic<Definition extends QueryDefinition<any, any, any, any>> {
	refetch(): void;
}

export interface QuerySubscriptionStore<Definition extends QueryDefinition<any, any, any, any>> {
	(queryArguments$: Writable<SkipToken | QueryArgFrom<any>>): Readable<
		QuerySubscriptionTopic<Definition>
	>;
}

function noop() {}

export function buildQuerySubscriptionModule<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	{
		serializeQueryArgs
	}: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>
) {
	return function buildQuerySubscriptionStoreForEndpoint(
		name: string
	): QuerySubscriptionStore<any> {
		return function buildQuerySubscriptionStore(
			queryArguments$: Writable<SkipToken | QueryArgFrom<any>>
		) {
			const localStore$ = getSvelteReduxContext().get();
			const { initiate } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;
			const querySubscription$: Readable<QuerySubscriptionTopic<any>> = derived(
				queryArguments$,
				// leaky abstraction, callback must accept two parameters for return value to be treated as cleanup
				function deriveInitiateSideEffect(queryArguments, set) {
					if (queryArguments === skipToken) {
						set({ refetch: noop });
						return noop;
					}
					const queryResult = (localStore$.dispatch as ThunkDispatch<any, any, UnknownAction>)(
						initiate(queryArguments)
					);
					set({ refetch: queryResult.refetch });
					return queryResult.unsubscribe;
				}
			);

			return querySubscription$;
		};
	};
}
