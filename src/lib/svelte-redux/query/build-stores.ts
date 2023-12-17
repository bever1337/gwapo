/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Api,
  ApiContext,
  CoreModule,
  EndpointDefinitions,
  MutationDefinition,
  QueryArgFrom,
  QueryDefinition,
  SerializeQueryArgs,
  SkipToken,
  SubscriptionOptions,
} from "@reduxjs/toolkit/query";
import { derived } from "svelte/store";
import type { Readable } from "svelte/store";

import { UNINITIALIZED_VALUE } from "./constants";
import { buildLazyQuerySubscriptionModule } from "./stores/lazy-query-subscription";
import type { LazyQuerySubscriptionTopic } from "./stores/lazy-query-subscription";
import { buildMutationeModule } from "./stores/mutation";
import type { MutationOptions, MutationTopic } from "./stores/mutation";
import { buildQueryStateModule } from "./stores/query-state";
import type { QueryStateOptions, QueryStateTopic } from "./stores/query-state";
import { buildQuerySubscriptionModule } from "./stores/query-subscription";
import type { QuerySubscriptionOptions, QuerySubscriptionTopic } from "./stores/query-subscription";
import { tuple } from "./stores/tuple";
import { writable } from "./stores/writable";

import type { SvelteReduxContext } from "../context";
import { shallowNotEqual } from "../equality";

export interface MutationStore<Definition extends MutationDefinition<any, any, any, any>> {
  mutation(initialMutationOptions?: MutationOptions<Definition>): {
    next(mutationOptions?: MutationOptions<Definition>): void;
    subscribe: Readable<MutationTopic<Definition>>["subscribe"];
  };
}

export interface QueryStores<Definition extends QueryDefinition<any, any, any, any>> {
  lazyQuery(initialQueryOptions?: SubscriptionOptions): {
    next(queryOptions?: SubscriptionOptions): void;
    subscribe: Readable<
      [
        LazyQuerySubscriptionTopic<Definition>[0],
        QueryStateTopic<Definition>,
        { lastArg: QueryArgFrom<Definition> }
      ]
    >["subscribe"];
  };
  lazyQuerySubscription(initialQueryOptions?: SubscriptionOptions): {
    next(queryOptions?: SubscriptionOptions): void;
    subscribe: Readable<LazyQuerySubscriptionTopic<Definition>>["subscribe"];
  };
  query(
    initialQueryArguments?: QueryArgFrom<Definition> | SkipToken,
    initialQueryOptions?: QueryStateOptions<Definition> & QuerySubscriptionOptions<Definition>
  ): {
    next(
      queryArguments?: QueryArgFrom<Definition> | SkipToken,
      queryOptions?: QueryStateOptions<Definition> & QuerySubscriptionOptions<Definition>
    ): void;
    subscribe: Readable<
      QueryStateTopic<Definition> & QuerySubscriptionTopic<Definition>
    >["subscribe"];
  };
  queryState(
    initialQueryArguments?: QueryArgFrom<Definition> | SkipToken,
    initialQueryOptions?: QueryStateOptions<Definition>
  ): {
    next(
      queryArguments?: QueryArgFrom<Definition> | SkipToken,
      queryOptions?: QueryStateOptions<Definition>
    ): void;
    subscribe: Readable<QueryStateTopic<Definition>>["subscribe"];
  };
  querySubscription(
    initialQueryArguments?: QueryArgFrom<Definition> | SkipToken,
    initialQueryOptions?: QuerySubscriptionOptions<Definition>
  ): {
    next(
      queryArguments?: QueryArgFrom<Definition> | SkipToken,
      queryOptions?: QuerySubscriptionOptions<Definition>
    ): void;
    subscribe: Readable<QuerySubscriptionTopic<Definition>>["subscribe"];
  };
}

export function buildStores<Definitions extends EndpointDefinitions>(
  api: Api<any, Definitions, any, any, CoreModule>,
  util: {
    serializeQueryArgs: SerializeQueryArgs<any>;
  },
  apiContext: ApiContext<Definitions>,
  componentContext: SvelteReduxContext
) {
  const buildLazyQuerySubscriptionStoreForEndpoint = buildLazyQuerySubscriptionModule(
    api,
    util,
    apiContext,
    componentContext
  );
  const buildMutationStoreForEndpoint = buildMutationeModule(
    api,
    util,
    apiContext,
    componentContext
  );
  const buildQueryStateStoreForEndpoint = buildQueryStateModule(
    api,
    util,
    apiContext,
    componentContext
  );
  const buildQuerySubscriptionStoreForEndpoint = buildQuerySubscriptionModule(
    api,
    util,
    apiContext,
    componentContext
  );

  return {
    buildQueryStores(name: string): QueryStores<any> {
      const buildLazyQuerySubscriptionStore = buildLazyQuerySubscriptionStoreForEndpoint(name);
      const buildQueryStateStore = buildQueryStateStoreForEndpoint(name);
      const buildQuerySubscriptionStore = buildQuerySubscriptionStoreForEndpoint(name);

      return {
        lazyQuery(initialQueryOptions) {
          const queryOptions$ = writable(initialQueryOptions, undefined, shallowNotEqual);
          const lazyQuerySubscription$ = buildLazyQuerySubscriptionStore(queryOptions$);
          const lazyQueryArguments$ = derived(
            [queryOptions$, lazyQuerySubscription$],
            ([queryOptions = {}, [, lastQueryArguments]]): [
              QueryArgFrom<any>,
              QueryStateOptions<any> | undefined
            ] => [
              lastQueryArguments,
              { ...queryOptions, skip: lastQueryArguments === UNINITIALIZED_VALUE },
            ]
          );
          const queryState$ = buildQueryStateStore(lazyQueryArguments$);
          /** @todo this store suffers extraneous updates */
          const composedLazyQuery$ = derived(
            [lazyQuerySubscription$, queryState$],
            ([[trigger, lastQueryArguments], queryState]): [
              LazyQuerySubscriptionTopic<any>[0],
              QueryStateTopic<any>,
              { lastArg: QueryArgFrom<any> }
            ] => [trigger, queryState, { lastArg: lastQueryArguments }]
          );
          return {
            next: queryOptions$.set,
            subscribe: composedLazyQuery$.subscribe,
          };
        },
        lazyQuerySubscription(initialQueryOptions) {
          const queryOptions$ = writable(initialQueryOptions, undefined, shallowNotEqual);
          const lazyQuerySubscription$ = buildLazyQuerySubscriptionStore(queryOptions$);
          return {
            next: queryOptions$.set,
            subscribe: lazyQuerySubscription$.subscribe,
          };
        },
        query(initialQueryArguments, initialQueryOptions) {
          const queryArguments$ = tuple(
            [initialQueryArguments, initialQueryOptions],
            undefined,
            shallowNotEqual
          );
          const queryState$ = buildQueryStateStore(queryArguments$);
          const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
          const composedQuery$ = derived(
            [queryState$, querySubscription$],
            ([queryState, querySubscription]) => ({
              ...queryState,
              ...querySubscription,
            })
          );
          return {
            next(queryArguments, queryOptions) {
              queryArguments$.set([queryArguments, queryOptions]);
            },
            subscribe: composedQuery$.subscribe,
          };
        },
        queryState(initialQueryArguments, initialQueryOptions) {
          const queryArguments$ = tuple(
            [initialQueryArguments, initialQueryOptions],
            undefined,
            shallowNotEqual
          );
          const queryState$ = buildQueryStateStore(queryArguments$);
          return {
            next(queryArguments, queryOptions) {
              queryArguments$.set([queryArguments, queryOptions]);
            },
            subscribe: queryState$.subscribe,
          };
        },
        querySubscription(initialQueryArguments, initialQueryOptions) {
          const queryArguments$ = tuple(
            [initialQueryArguments, initialQueryOptions],
            undefined,
            shallowNotEqual
          );
          const querySubscription$ = buildQuerySubscriptionStore(queryArguments$);
          return {
            next(queryArguments, queryOptions) {
              queryArguments$.set([queryArguments, queryOptions]);
            },
            subscribe: querySubscription$.subscribe,
          };
        },
      };
    },
    buildMutationStores(name: string): MutationStore<any> {
      const buildMutationStore = buildMutationStoreForEndpoint(name);
      return {
        mutation(initialMutationOptions) {
          const mutationOptions$ = writable(initialMutationOptions, undefined, shallowNotEqual);
          const mutation$ = buildMutationStore(mutationOptions$);
          return {
            next: mutationOptions$.set,
            subscribe: mutation$.subscribe,
          };
        },
      };
    },
  };
}
