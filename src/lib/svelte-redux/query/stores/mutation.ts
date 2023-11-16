/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@reduxjs/toolkit/query";
import type { Selector, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { derived, writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";

import type { SvelteReduxContext } from "../../context";

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
export type IntermediateMutationTopic<Definition extends MutationDefinition<any, any, any, any>> = [
  trigger: MutationTopic<Definition>[0],
  currentState: {
    originalArgs?: MutationTopic<Definition>[1]["originalArgs"];
    reset: MutationTopic<Definition>[1]["reset"];
    selectResult: Selector<any, MutationResultSelectorResult<Definition>>;
  }
];

const defaultMutationOptions: MutationOptions<any> = {};

export function buildMutationeModule<Definitions extends EndpointDefinitions>(
  api: Api<any, Definitions, any, any, CoreModule>,
  util: {
    serializeQueryArgs: SerializeQueryArgs<any>;
  },
  context: ApiContext<Definitions>,
  componentContext: SvelteReduxContext
) {
  return function buildMutationStoreForEndpoint(name: string): MutationStore<any> {
    return function buildMutationStore(mutationArguments$) {
      const { initiate, select } = api.endpoints[name] as ApiEndpointMutation<
        MutationDefinition<any, any, any, any, any>,
        Definitions
      >;

      const reduxStore$ = componentContext.get();
      const dispatch = reduxStore$.dispatch as ThunkDispatch<any, any, UnknownAction>;

      const mutationResult$: Writable<MutationActionCreatorResult<any> | undefined> = writable();

      const intermediateMutationTopic$: Readable<IntermediateMutationTopic<any>> = derived(
        [mutationArguments$, mutationResult$],
        function deriveIntermediateResult([
          [, { fixedCacheKey, selectFromResult } = defaultMutationOptions],
          mutationResult,
        ]): IntermediateMutationTopic<any> {
          const selectDefaultResult = select({
            fixedCacheKey,
            requestId: mutationResult?.requestId,
          });
          return [
            function trigger(mutationArguments?: Parameters<typeof initiate>[0]) {
              const mutationResult = dispatch(initiate(mutationArguments, { fixedCacheKey }));
              mutationResult$.set(mutationResult);
              return mutationResult;
            },
            {
              reset() {
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
              },
              originalArgs: fixedCacheKey ? undefined : mutationResult?.arg.originalArgs,
              selectResult(state: Parameters<typeof selectDefaultResult>[0]) {
                const selected = selectDefaultResult(state);
                if (selectFromResult) {
                  return selectFromResult(selected);
                }
                return selected;
              },
            },
          ];
        }
      );

      const mutationTopic$: Readable<MutationTopic<any, any>> = derived(
        [reduxStore$, intermediateMutationTopic$],
        function deriveResult([state, [trigger, { originalArgs, reset, selectResult }]], set) {
          const currentResult = selectResult(state);
          const safeToSpreadResult =
            currentResult !== null && typeof currentResult === "object"
              ? currentResult
              : defaultResult;
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

      return mutationTopic$;
    };
  };
}
