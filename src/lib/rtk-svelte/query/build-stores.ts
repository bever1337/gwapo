/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
	Api,
	ApiContext,
	CoreModule,
	EndpointDefinitions,
	MutationDefinition,
	QueryArgFrom,
	QueryDefinition,
	SerializeQueryArgs
} from '@reduxjs/toolkit/query';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { buildQueryStateModule } from './stores/query-state';
import type { QueryStateOptions, QueryStateTopic } from './stores/query-state';
import { buildQuerySubscriptionModule } from './stores/query-subscription';
import type { QuerySubscriptionOptions, QuerySubscriptionTopic } from './stores/query-subscription';

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {}
export interface QueryStores<Definition extends QueryDefinition<any, any, any, any>> {
	query(
		initialQueryArguments?: QueryArgFrom<Definition>,
		initialQueryOptions?: QueryStateOptions<Definition> & QuerySubscriptionOptions<Definition>
	): {
		next(
			queryArguments?: QueryArgFrom<Definition>,
			queryOptions?: QueryStateOptions<Definition> & QuerySubscriptionOptions<Definition>
		): void;
		subscribe: Readable<
			QueryStateTopic<Definition> & QuerySubscriptionTopic<Definition>
		>['subscribe'];
	};
	queryState(
		initialQueryArguments?: QueryArgFrom<Definition>,
		initialQueryOptions?: QueryStateOptions<Definition>
	): {
		next(
			queryArguments?: QueryArgFrom<Definition>,
			queryOptions?: QueryStateOptions<Definition>
		): void;
		subscribe: Readable<QueryStateTopic<Definition>>['subscribe'];
	};
	querySubscription(
		initialQueryArguments?: QueryArgFrom<Definition>,
		initialQueryOptions?: QuerySubscriptionOptions<Definition>
	): {
		next(
			queryArguments?: QueryArgFrom<Definition>,
			queryOptions?: QuerySubscriptionOptions<Definition>
		): void;
		subscribe: Readable<QuerySubscriptionTopic<Definition>>['subscribe'];
	};
}

export function buildStores<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	{
		serializeQueryArgs
	}: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>
) {
	const buildQueryStateStoreForEndpoint = buildQueryStateModule(
		api,
		{ serializeQueryArgs },
		context
	);
	const buildQuerySubscriptionStoreForEndpoint = buildQuerySubscriptionModule(
		api,
		{ serializeQueryArgs },
		context
	);

	return { buildQueryStores, buildMutationStore };

	function buildQueryStores(name: string): QueryStores<any> {
		const buildQueryStateStore = buildQueryStateStoreForEndpoint(name);
		const buildQuerySubscriptionStore = buildQuerySubscriptionStoreForEndpoint(name);

		return {
			query(initialQueryArguments, initialQueryOptions) {
				const queryArguments$: Writable<
					[QueryArgFrom<any>, (QueryStateOptions<any> & QuerySubscriptionOptions<any>) | undefined]
				> = writable([initialQueryArguments, initialQueryOptions]);
				const queryState$ = buildQueryStateStore(queryArguments$);
				const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
				const composedQuery$ = derived(
					[queryState$, querySubscription$],
					([queryState, querySubscription]) => ({
						...queryState,
						refetch: querySubscription.refetch
					})
				);
				return {
					next(queryArguments, queryOptions) {
						queryArguments$.set([queryArguments, queryOptions]);
					},
					subscribe: composedQuery$.subscribe
				};
			},
			queryState(initialQueryArguments, initialQueryOptions) {
				const queryArguments$: Writable<[QueryArgFrom<any>, QueryStateOptions<any> | undefined]> =
					writable([initialQueryArguments, initialQueryOptions]);
				const queryState$ = buildQueryStateStore(queryArguments$);
				return {
					next(queryArguments, queryOptions) {
						queryArguments$.set([queryArguments, queryOptions]);
					},
					subscribe: queryState$.subscribe
				};
			},
			querySubscription(initialQueryArguments, initialQueryOptions) {
				const queryArguments$: Writable<
					[QueryArgFrom<any>, QuerySubscriptionOptions<any> | undefined]
				> = writable([initialQueryArguments, initialQueryOptions]);
				const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
				return {
					next(queryArguments, queryOptions) {
						queryArguments$.set([queryArguments, queryOptions]);
					},
					subscribe: querySubscription$.subscribe
				};
			}
		};
	}

	function buildMutationStore(name: string) {
		return {};
	}
}
