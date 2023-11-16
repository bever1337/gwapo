/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Api,
  ApiContext,
  ApiEndpointQuery,
  CoreModule,
  EndpointDefinitions,
  QueryArgFrom,
  QueryDefinition,
  SerializeQueryArgs,
  SubscriptionOptions,
} from "@reduxjs/toolkit/query";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { derived } from "svelte/store";
import type { Readable } from "svelte/store";

import { UNINITIALIZED_VALUE } from "../constants";
import type { SvelteReduxContext } from "../../context";

export type LazyQuerySubscriptionTopic<Definition extends QueryDefinition<any, any, any, any>> = [
  trigger: (queryArguments: QueryArgFrom<Definition>, preferCacheValue?: boolean) => void,
  lastQueryArguments?: QueryArgFrom<Definition>
];

export interface LazyQuerySubscriptionStore<
  Definition extends QueryDefinition<any, any, any, any>
> {
  (queryArguments$: Readable<[undefined, SubscriptionOptions | undefined]>): Readable<
    LazyQuerySubscriptionTopic<Definition>
  >;
}

const defaultLazyQuerySubscriptionOptions: SubscriptionOptions = {};
const initialLazyQuerySubscriptionTopic: LazyQuerySubscriptionTopic<any> = [
  function noop() {},
  UNINITIALIZED_VALUE,
];

export function buildLazyQuerySubscriptionModule<Definitions extends EndpointDefinitions>(
  api: Api<any, Definitions, any, any, CoreModule>,
  util: {
    serializeQueryArgs: SerializeQueryArgs<any>;
  },
  context: ApiContext<Definitions>,
  componentContext: SvelteReduxContext
) {
  return function buildLazyQuerySubscriptionStoreForEndpoint(
    name: string
  ): LazyQuerySubscriptionStore<any> {
    return function buildLazyQuerySubscriptionStore(queryArguments$) {
      const { initiate } = api.endpoints[name] as ApiEndpointQuery<
        QueryDefinition<any, any, any, any, any>,
        Definitions
      >;

      const reduxStore$ = componentContext.get();
      const dispatch = reduxStore$.dispatch as ThunkDispatch<any, any, UnknownAction>;

      let unsubscribe: () => void;

      const lazyQuerySubscriptionTopic$ = derived(
        queryArguments$,
        function initiateSideEffect(
          [
            ,
            {
              pollingInterval = 0,
              refetchOnFocus,
              refetchOnReconnect,
            } = defaultLazyQuerySubscriptionOptions,
          ],
          set
        ) {
          const trigger = (queryArguments: QueryArgFrom<any>, preferCacheValue = false) => {
            unsubscribe?.();
            const queryResult = dispatch(
              initiate(queryArguments, {
                forceRefetch: !preferCacheValue,
                subscriptionOptions: {
                  pollingInterval,
                  refetchOnFocus,
                  refetchOnReconnect,
                },
              })
            );
            unsubscribe = queryResult.unsubscribe;
            set([trigger, queryArguments]);
          };
          set([trigger, UNINITIALIZED_VALUE]);
          // do not directly return unsubscribe, its reference may change
          return function cleanup() {
            unsubscribe?.();
          };
        },
        initialLazyQuerySubscriptionTopic
      );

      return lazyQuerySubscriptionTopic$;
    };
  };
}
