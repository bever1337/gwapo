/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { skipToken } from "@reduxjs/toolkit/query";
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

import type { SvelteReduxContext } from "../../context";

export interface QuerySubscriptionTopic<Definition extends QueryDefinition<any, any, any, any>> {
  refetch(): void;
}

export interface QuerySubscriptionStore<Definition extends QueryDefinition<any, any, any, any>> {
  (
    queryArguments$: Readable<
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
  context: ApiContext<Definitions>,
  componentContext: SvelteReduxContext
) {
  return function buildQuerySubscriptionStoreForEndpoint(
    name: string
  ): QuerySubscriptionStore<any> {
    return function buildQuerySubscriptionStore(queryArguments$) {
      const { initiate } = api.endpoints[name] as ApiEndpointQuery<
        QueryDefinition<any, any, any, any, any>,
        Definitions
      >;

      const reduxStore$ = componentContext.get();
      const dispatch = reduxStore$.dispatch as ThunkDispatch<any, any, UnknownAction>;

      const querySubscriptionTopic$: Readable<QuerySubscriptionTopic<any>> = derived(
        queryArguments$,
        function initiateSideEffect(
          [
            queryArguments,
            {
              pollingInterval = 0,
              refetchOnFocus,
              refetchOnMountOrArgChange,
              refetchOnReconnect,
              skip = false,
            } = defaultQuerySubscriptionOptions,
          ],
          set
        ) {
          if (queryArguments === skipToken || skip === true) {
            set(initialQuerySubscriptionTopic);
            return noop;
          }
          const queryResult = dispatch(
            initiate(queryArguments, {
              forceRefetch: refetchOnMountOrArgChange,
              subscriptionOptions: {
                pollingInterval,
                refetchOnFocus,
                refetchOnReconnect,
              },
            })
          );
          set({ refetch: queryResult.refetch });
          return queryResult.unsubscribe;
        },
        initialQuerySubscriptionTopic
      );

      return querySubscriptionTopic$;
    };
  };
}
