/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
	Api,
	ApiContext,
	ApiEndpointMutation,
	CoreModule,
	EndpointDefinitions,
	MutationActionCreatorResult,
	MutationDefinition,
	MutationResultSelectorResult,
	QueryArgFrom,
	SerializeQueryArgs,
} from '@reduxjs/toolkit/query';
import type { Selector, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

import { createSvelteReduxContext } from '../..';
import type { SvelteReduxContextKey } from '../..';

const defaultResult = {};

export type MutationTopic<
	Definition extends MutationDefinition<any, any, any, any>,
	ResultType extends Record<string, any> = MutationResultSelectorResult<Definition>
> = [
	trigger: (
		mutationArguments?: QueryArgFrom<Definition>
	) => MutationActionCreatorResult<Definition>,
	currentState: ResultType & {
		originalArgs?: QueryArgFrom<Definition>;
		reset(): void;
	}
];

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {
	<ResultType extends Record<string, any> = MutationResultSelectorResult<Definition>>(
		mutationArguments$: Readable<[undefined, MutationOptions<Definition> | undefined]>
	): Readable<MutationTopic<Definition, ResultType>>;
}

export type MutationStateSelector<
	Definition extends MutationDefinition<any, any, any, any>,
	ResultType extends Record<string, any> = MutationResultSelectorResult<Definition>
> = (state: MutationResultSelectorResult<Definition>) => ResultType;

export interface MutationOptions<Definition extends MutationDefinition<any, any, any, any>> {
	selectFromResult?: MutationStateSelector<any, Definition>;
	fixedCacheKey?: string;
}

/** @internal */
export interface DerivedMutationOptions<Definition extends MutationDefinition<any, any, any, any>>
	extends MutationOptions<Definition> {
	reset(): void;
	selectResult: Selector<any, MutationResultSelectorResult<Definition>>;
	trigger(): MutationActionCreatorResult<Definition>;
}

const defaultMutationOptions: MutationOptions<any> = {};

export function buildMutationeModule<Definitions extends EndpointDefinitions>(
	api: Api<any, Definitions, any, any, CoreModule>,
	util: {
		serializeQueryArgs: SerializeQueryArgs<any>;
	},
	context: ApiContext<Definitions>,
	contextKey: SvelteReduxContextKey
) {
	const SvelteReduxContext = createSvelteReduxContext(contextKey);
	return function buildMutationStoreForEndpoint(name: string): MutationStore<any> {
		return function buildMutationStore(mutationArguments$) {
			const localStore$ = SvelteReduxContext.get();
			const dispatch = localStore$.dispatch as ThunkDispatch<any, any, UnknownAction>;
			const { initiate, select } = api.endpoints[name] as ApiEndpointMutation<
				MutationDefinition<any, any, any, any, any>,
				Definitions
			>;

			const mutationResult$: Writable<MutationActionCreatorResult<any> | undefined> = writable();

			const mutationSelector$ = derived(
				[mutationArguments$, mutationResult$],
				function deriveSelector([[, mutationOptions = defaultMutationOptions], mutationResult]): [
					MutationActionCreatorResult<any> | undefined,
					DerivedMutationOptions<any>
				] {
					const { fixedCacheKey, selectFromResult } = mutationOptions;
					const reset = function resetMutation() {
						if (mutationResult) {
							mutationResult$.set(undefined);
						}
						if (fixedCacheKey) {
							dispatch(
								api.internalActions.removeMutationResult({
									requestId: mutationResult?.requestId,
									fixedCacheKey,
								})
							);
						}
					};
					const trigger = function triggerMutation(
						mutationArguments?: Parameters<typeof initiate>[0]
					) {
						const mutationResult = dispatch(initiate(mutationArguments, { fixedCacheKey }));
						mutationResult$.set(mutationResult);
						return mutationResult;
					};
					const selectDefaultResult = select({
						fixedCacheKey,
						requestId: mutationResult?.requestId,
					});
					return [
						mutationResult,
						{
							...mutationOptions,
							reset,
							selectResult(state: Parameters<typeof selectDefaultResult>[0]) {
								const selected = selectDefaultResult(state);
								if (selectFromResult) {
									return selectFromResult(selected);
								}
								return selected;
							},
							trigger,
						},
					];
				}
			);

			const mutationState$: Readable<MutationTopic<any, any>> = derived(
				[localStore$, mutationSelector$],
				function deriveResult(
					[state, [mutationResult, { fixedCacheKey, reset, selectResult, trigger }]],
					set
				) {
					const currentResult = selectResult(state);
					const safeToSpreadResult =
						currentResult !== null && typeof currentResult === 'object'
							? currentResult
							: defaultResult;
					const originalArgs = fixedCacheKey ? undefined : mutationResult?.arg.originalArgs;
					set([
						trigger,
						{
							...safeToSpreadResult,
							originalArgs,
							reset,
						},
					]);
				}
			);

			return mutationState$;
		};
	};
}
