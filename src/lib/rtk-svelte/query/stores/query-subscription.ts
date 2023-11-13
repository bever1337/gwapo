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
	SubscriptionOptions
} from '@reduxjs/toolkit/query';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { derived, readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { getSvelteReduxContext } from '../..';

export interface QuerySubscriptionTopic<Definition extends QueryDefinition<any, any, any, any>> {
	refetch(): void;
}

export interface QuerySubscriptionStore<Definition extends QueryDefinition<any, any, any, any>> {
	(
		queryArguments$: Writable<
			[QueryArgFrom<Definition>, QuerySubscriptionOptions<Definition> | undefined]
		>
	): Readable<QuerySubscriptionTopic<Definition>>;
}

export interface QuerySubscriptionOptions<Definition extends QueryDefinition<any, any, any, any>>
	extends SubscriptionOptions {
	skip?: boolean;
	refetchOnMountOrArgChange?: boolean | number;
}

function noop() {}
const defaultQuerySubscriptionOptions: QuerySubscriptionOptions<any> = {};
const initialQuerySubscriptionTopic = { refetch: noop };

export function buildQuerySubscriptionModule<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	util: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>
) {
	return function buildQuerySubscriptionStoreForEndpoint(
		name: string
	): QuerySubscriptionStore<any> {
		return function buildQuerySubscriptionStore(queryArguments$) {
			const { initiate } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;
			const localStore$ = getSvelteReduxContext().get();
			const dispatch = localStore$.dispatch as ThunkDispatch<any, any, UnknownAction>;
			const querySubscription$: Readable<QuerySubscriptionTopic<any>> = derived(
				queryArguments$,
				function initiateSideEffect(
					[
						queryArguments,
						{
							pollingInterval = 0,
							refetchOnFocus,
							refetchOnMountOrArgChange,
							refetchOnReconnect,
							skip = false
						} = defaultQuerySubscriptionOptions
					],
					set
				) {
					const queryResult = dispatch(
						initiate(skip ? skipToken : queryArguments, {
							forceRefetch: refetchOnMountOrArgChange,
							subscriptionOptions: {
								pollingInterval,
								refetchOnFocus,
								refetchOnReconnect
							}
						})
					);
					set({ refetch: queryResult.refetch });
					return queryResult.unsubscribe;
				},
				initialQuerySubscriptionTopic
			);

			return querySubscription$;
		};
	};
}
