/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { skipToken } from '@reduxjs/toolkit/query';
import type {
	Api,
	ApiContext,
	ApiEndpointQuery,
	CoreModule,
	EndpointDefinitions,
	MutationDefinition,
	QueryArgFrom,
	QueryDefinition,
	QueryResultSelectorResult,
	SerializeQueryArgs,
	SkipToken
} from '@reduxjs/toolkit/query';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { getSvelteReduxContext } from '..';

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {}
export interface QueryStores<Definition extends QueryDefinition<any, any, any, any>> {
	query(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<
			Omit<QueryResultSelectorResult<Definition>, 'isLoading'> & {
				currentData: any;
				isFetching: boolean;
				isLoading: boolean;
			}
		>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
	};
	queryState(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<
			Omit<QueryResultSelectorResult<Definition>, 'isLoading'> & {
				currentData: any;
				isFetching: boolean;
				isLoading: boolean;
			}
		>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
	};
	querySubscription(initialQueryArguments?: QueryArgFrom<Definition> | SkipToken): {
		set: Writable<QueryArgFrom<Definition> | SkipToken>['set'];
		subscribe: Readable<unknown>['subscribe'];
		update: Writable<QueryArgFrom<Definition> | SkipToken>['update'];
	};
}

function noop() {}

export function buildStores<Definitions extends EndpointDefinitions>({
	api,
	context,
	serializeQueryArgs
}: {
	api: Api<any, Definitions, any, any, CoreModule>;
	context: ApiContext<Definitions>;
	serializeQueryArgs: SerializeQueryArgs<any>;
}) {
	return { buildQueryStores, buildMutationStore };

	function buildQueryStores(name: string): QueryStores<any> {
		return {
			query(initialQueryArguments) {
				const queryArguments$ = writable<SkipToken | QueryArgFrom<any>>(initialQueryArguments);
				const queryState$ = buildQueryStateStore(queryArguments$);
				const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
				const composedQuery$ = derived([queryState$, querySubscription$], ([result]) => result);
				return {
					set: queryArguments$.set,
					subscribe: composedQuery$.subscribe,
					update: queryArguments$.update
				};
			},
			queryState(initialQueryArguments) {
				const queryArguments$ = writable<SkipToken | QueryArgFrom<any>>(initialQueryArguments);
				const queryState$ = buildQueryStateStore(queryArguments$);
				return {
					set: queryArguments$.set,
					subscribe: queryState$.subscribe,
					update: queryArguments$.update
				};
			},
			querySubscription(initialQueryArguments) {
				const queryArguments$ = writable<SkipToken | QueryArgFrom<any>>(initialQueryArguments);
				const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
				return {
					set: queryArguments$.set,
					subscribe: querySubscription$.subscribe,
					update: queryArguments$.update
				};
			}
		};

		function buildQueryStateStore(queryArguments$: Writable<SkipToken | QueryArgFrom<any>>) {
			const localStore$ = getSvelteReduxContext().get();
			const { select } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;

			const querySelector$ = derived(queryArguments$, function deriveSelector(queryArguments) {
				return select(queryArguments);
			});
			const queryResult$: Readable<
				Omit<QueryResultSelectorResult<any>, 'isLoading'> & {
					currentData: any;
					isFetching: boolean;
					isLoading: boolean;
				}
			> = derived(
				[localStore$, querySelector$],
				function deriveResult([state, selector], set, update) {
					const currentState = selector(state as unknown as Parameters<typeof selector>[0]);
					update((lastResult) => {
						let data = currentState.isSuccess ? currentState.data : lastResult?.data;
						if (data === undefined) data = currentState.data;

						const hasData = data !== undefined;

						// isFetching = true any time a request is in flight
						const isFetching = currentState.isLoading;
						// isLoading = true only when loading while no data is present yet (initial load with no data in the cache)
						const isLoading = !hasData && isFetching;
						// isSuccess = true when data is present
						const isSuccess = currentState.isSuccess || (isFetching && hasData);

						return {
							...currentState,
							data,
							currentData: currentState.data,
							isFetching,
							isLoading,
							isSuccess
						};
					});
				}
			);
			return queryResult$;
		}

		function buildQuerySubscriptionStore(queryArguments$: Writable<SkipToken | QueryArgFrom<any>>) {
			const localStore$ = getSvelteReduxContext().get();
			const { initiate } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;
			const initiator$: Readable<{ refetch(): void }> = derived(
				queryArguments$,
				// leaky abstraction, callback must accept two parameters for return value to be treated as cleanup
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

			return initiator$;
		}
	}

	function buildMutationStore(name: string) {
		return {};
	}
}
