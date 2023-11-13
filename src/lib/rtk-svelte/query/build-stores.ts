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
	SubscriptionOptions
} from '@reduxjs/toolkit/query';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { buildLazyQuerySubscriptionModule } from './stores/lazy-query-subscription';
import type { LazyQuerySubscriptionTopic } from './stores/lazy-query-subscription';
import { buildQueryStateModule } from './stores/query-state';
import type { QueryStateOptions, QueryStateTopic } from './stores/query-state';
import { buildQuerySubscriptionModule } from './stores/query-subscription';
import type { QuerySubscriptionOptions, QuerySubscriptionTopic } from './stores/query-subscription';

import { UNINITIALIZED_VALUE } from './constants';

import type { SvelteReduxContextKey } from '..';

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {}
export interface QueryStores<Definition extends QueryDefinition<any, any, any, any>> {
	lazyQuery(initialQueryOptions?: SubscriptionOptions): {
		next(queryOptions?: SubscriptionOptions): void;
		subscribe: Readable<
			[
				LazyQuerySubscriptionTopic<Definition>[0],
				QueryStateTopic<Definition>,
				{ lastArg: QueryArgFrom<Definition> }
			]
		>['subscribe'];
	};
	lazyQuerySubscription(initialQueryOptions?: SubscriptionOptions): {
		next(queryOptions?: SubscriptionOptions): void;
		subscribe: Readable<LazyQuerySubscriptionTopic<Definition>>['subscribe'];
	};
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
	context: ApiContext<Definitions>,
	contextKey: SvelteReduxContextKey
) {
	const builderParameters = [api, { serializeQueryArgs }, context, contextKey] as const;
	const buildLazyQuerySubscriptionStoreForEndpoint = buildLazyQuerySubscriptionModule(
		...builderParameters
	);
	const buildQueryStateStoreForEndpoint = buildQueryStateModule(...builderParameters);
	const buildQuerySubscriptionStoreForEndpoint = buildQuerySubscriptionModule(...builderParameters);

	return { buildQueryStores, buildMutationStore };

	function buildQueryStores(name: string): QueryStores<any> {
		const buildLazyQuerySubscriptionStore = buildLazyQuerySubscriptionStoreForEndpoint(name);
		const buildQueryStateStore = buildQueryStateStoreForEndpoint(name);
		const buildQuerySubscriptionStore = buildQuerySubscriptionStoreForEndpoint(name);

		return {
			lazyQuery(initialQueryOptions) {
				const queryOptions$: Writable<[undefined, SubscriptionOptions | undefined]> = writable([
					undefined,
					initialQueryOptions
				]);
				const lazyQuerySubscription$ = buildLazyQuerySubscriptionStore(queryOptions$);
				const queryArguments$ = derived(
					[queryOptions$, lazyQuerySubscription$],
					([[, queryOptions = {}], [, lastQueryArguments]]): [
						QueryArgFrom<any>,
						QueryStateOptions<any> | undefined
					] => [
						lastQueryArguments,
						{ ...queryOptions, skip: lastQueryArguments === UNINITIALIZED_VALUE }
					]
				);
				const queryState$ = buildQueryStateStore(queryArguments$);
				/** @todo this store may update twice when options change */
				const composedLazyQuery$ = derived(
					[lazyQuerySubscription$, queryState$],
					([[trigger, lastQueryArguments], queryState]): [
						LazyQuerySubscriptionTopic<any>[0],
						QueryStateTopic<any>,
						{ lastArg: QueryArgFrom<any> }
					] => [trigger, queryState, { lastArg: lastQueryArguments }]
				);
				return {
					next(queryOptions) {
						queryOptions$.set([undefined, queryOptions]);
					},
					subscribe: composedLazyQuery$.subscribe
				};
			},
			lazyQuerySubscription(initialQueryOptions) {
				const queryArguments$: Writable<[undefined, SubscriptionOptions | undefined]> = writable([
					undefined,
					initialQueryOptions
				]);
				const lazyQuerySubscription$ = buildLazyQuerySubscriptionStore(queryArguments$);
				return {
					next(queryOptions) {
						queryArguments$.set([undefined, queryOptions]);
					},
					subscribe: lazyQuerySubscription$.subscribe
				};
			},
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
