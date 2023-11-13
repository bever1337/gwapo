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
} from '@reduxjs/toolkit/query';
import type { Selector } from '@reduxjs/toolkit';
import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';

import { createSvelteReduxContext } from '../..';
import type { SvelteReduxContextKey } from '../..';

export interface QueryStateTopic<Definition extends QueryDefinition<any, any, any, any>>
	extends Omit<QueryResultSelectorResult<Definition>, 'isLoading'> {
	currentData: any;
	isFetching: boolean;
	isLoading: boolean;
}

export interface QueryStateStore<Definition extends QueryDefinition<any, any, any, any>> {
	(
		queryArguments$: Readable<[QueryArgFrom<Definition>, QueryStateOptions<Definition> | undefined]>
	): Readable<QueryStateTopic<Definition>>;
}

export type QueryStateSelector<
	R extends Record<string, any>,
	D extends QueryDefinition<any, any, any, any>
> = (state: QueryStateTopic<D>) => R;

export interface QueryStateOptions<Definition extends QueryDefinition<any, any, any, any>> {
	skip?: boolean;
	selectFromResult?: QueryStateSelector<any, Definition>;
}

type IntermediateQueryStateTopic<Definition extends QueryDefinition<any, any, any, any>> = [
	intermediateTopic: QueryStateTopic<Definition>,
	intermediateOptions: QueryStateOptions<Definition> & {
		selectDefaultResult: Selector<any, QueryResultSelectorResult<Definition>>;
	}
];

const defaultQueryStateOptions: QueryStateOptions<any> = {};
const initialQueryState = [{}, {}] as IntermediateQueryStateTopic<any>;

export function buildQueryStateModule<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	util: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>,
	contextKey: SvelteReduxContextKey
) {
	const SvelteReduxContext = createSvelteReduxContext(contextKey);
	return function buildQueryStateStoreForEndpoint(name: string): QueryStateStore<any> {
		return function buildQueryStateStore(queryArguments$) {
			const { select } = api.endpoints[name] as ApiEndpointQuery<
				QueryDefinition<any, any, any, any, any>,
				Definitions
			>;

			const querySelector$: Readable<[QueryArgFrom<any>, IntermediateQueryStateTopic<any>[1]]> =
				derived(
					queryArguments$,
					function deriveSelector([queryArguments, queryOptions = defaultQueryStateOptions]): [
						QueryArgFrom<any>,
						IntermediateQueryStateTopic<any>[1]
					] {
						const { skip } = queryOptions;
						const selectorArguments = (skip ? skipToken : queryArguments) as Parameters<
							ReturnType<typeof select>
						>[0];
						return [
							queryArguments,
							{
								...queryOptions,
								selectDefaultResult: select(selectorArguments),
							},
						];
					}
				);

			const reduxStore$ = SvelteReduxContext.get();

			const intermediateQueryStateTopic$: Readable<IntermediateQueryStateTopic<any>> = derived(
				[reduxStore$, querySelector$],
				function deriveResult([state, [, queryOptions]], set, update) {
					const { selectDefaultResult } = queryOptions;
					const currentState = selectDefaultResult(state);
					update(function updateResult([lastResult]) {
						let data = currentState.isSuccess ? currentState.data : lastResult?.data;
						if (data === undefined) data = currentState.data;

						const hasData = data !== undefined;

						// isFetching = true any time a request is in flight
						const isFetching = currentState.isLoading;
						// isLoading = true only when loading while no data is present yet (initial load with no data in the cache)
						const isLoading = !hasData && isFetching;
						// isSuccess = true when data is present
						const isSuccess = currentState.isSuccess || (isFetching && hasData);

						return [
							{
								...currentState,
								data,
								currentData: currentState.data,
								isFetching,
								isLoading,
								isSuccess,
							},
							queryOptions,
						];
					});
				},
				initialQueryState
			);

			const queryStateTopic$ = derived(
				intermediateQueryStateTopic$,
				function selectFinalState([queryResult, { selectFromResult }]) {
					return selectFromResult ? selectFromResult(queryResult) : queryResult;
				}
			);

			return queryStateTopic$;
		};
	};
}
