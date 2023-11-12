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
	QueryResultSelectorResult,
	SerializeQueryArgs,
	SkipToken
} from '@reduxjs/toolkit/query';
import { derived } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { getSvelteReduxContext } from '../..';

export interface QueryStateTopic<Definition extends QueryDefinition<any, any, any, any>>
	extends Omit<QueryResultSelectorResult<Definition>, 'isLoading'> {
	currentData: any;
	isFetching: boolean;
	isLoading: boolean;
}

export interface QueryStateStore<Definition extends QueryDefinition<any, any, any, any>> {
	(queryArguments$: Writable<QueryArgFrom<Definition>>): Readable<QueryStateTopic<Definition>>;
}

export function buildQueryStateModule<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	{
		serializeQueryArgs
	}: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>
) {
	return function buildQueryStateStoreForEndpoint(name: string): QueryStateStore<any> {
		return function buildQueryStateStore(queryArguments$) {
			const { select } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;
			const localStore$ = getSvelteReduxContext().get();
			const querySelector$ = derived(queryArguments$, function deriveSelector(queryArguments) {
				return select(queryArguments as Parameters<ReturnType<typeof select>>[0]);
			});
			const queryState$: Readable<QueryStateTopic<any>> = derived(
				[localStore$, querySelector$],
				function deriveResult([state, selector], set, update) {
					const currentState = selector(state);
					update(function updateResult(lastResult) {
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
			return queryState$;
		};
	};
}
