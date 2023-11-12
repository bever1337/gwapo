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
	SerializeQueryArgs,
	SkipToken
} from '@reduxjs/toolkit/query';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { buildQueryStateModule } from './stores/query-state';
import type { QueryStateTopic } from './stores/query-state';
import { buildQuerySubscriptionModule } from './stores/query-subscription';
import type { QuerySubscriptionTopic } from './stores/query-subscription';

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {}
export interface QueryStores<Definition extends QueryDefinition<any, any, any, any>> {
	query(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<
			QueryStateTopic<Definition> & QuerySubscriptionTopic<Definition>
		>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
	};
	queryState(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<QueryStateTopic<Definition>>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
	};
	querySubscription(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<QuerySubscriptionTopic<Definition>>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
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
			query(initialQueryArguments) {
				const queryArguments$ = writable(initialQueryArguments);
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
					set: queryArguments$.set,
					subscribe: composedQuery$.subscribe,
					update: queryArguments$.update
				};
			},
			queryState(initialQueryArguments) {
				const queryArguments$ = writable(initialQueryArguments);
				const queryState$ = buildQueryStateStore(queryArguments$);
				return {
					set: queryArguments$.set,
					subscribe: queryState$.subscribe,
					update: queryArguments$.update
				};
			},
			querySubscription(initialQueryArguments) {
				const queryArguments$ = writable(initialQueryArguments);
				const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
				return {
					set: queryArguments$.set,
					subscribe: querySubscription$.subscribe,
					update: queryArguments$.update
				};
			}
		};
	}

	function buildMutationStore(name: string) {
		return {};
	}
}
