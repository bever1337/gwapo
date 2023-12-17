/* eslint-disable @typescript-eslint/no-explicit-any */
import { derived } from "svelte/store";
import type { Readable } from "svelte/store";

import { createSvelteReduxContext, svelteReduxContextKey } from "./context";
import { referenceNotEqual, shallowNotEqual } from "./equality";
import { writable } from "./query/stores/writable";

export interface SelectorStore<Result = unknown, Parameters extends readonly any[] = any[]> {
  reselect(...parameters: Parameters): void;
  subscribe: Readable<Result>["subscribe"];
}

export interface GetSelector<AppState = unknown> {
  <Result = unknown, Parameters extends readonly any[] = any[]>(
    selector: (state: AppState, ...parameters: Parameters) => Result,
    ...parameters: Parameters
  ): SelectorStore<Result, Parameters>;
}

export function createGetSelector<AppState = unknown>(
  context = svelteReduxContextKey
): GetSelector {
  return function getSelector<Result = unknown, Parameters extends readonly any[] = any[]>(
    selector: (state: AppState, ...parameters: Parameters) => Result,
    ...parameters: Parameters
  ): SelectorStore<Result, Parameters> {
    const storeContext = createSvelteReduxContext<AppState>(context);

    const store$ = storeContext.get();

    const parameters$ = writable(parameters, undefined, shallowNotEqual);

    const selector$ = derived(
      [store$, parameters$],
      function callSelector([state, parameters]: [AppState, Parameters]) {
        return selector(state, ...parameters);
      }
    );

    const final$ = writable<Result>(undefined, undefined, referenceNotEqual);

    return {
      reselect(...parameters: Parameters) {
        parameters$.set(parameters);
      },
      subscribe(run) {
        const unsubscribeFromSelector = selector$.subscribe(final$.set);
        const unsubscribeFromFinal = final$.subscribe(run);

        return function cleanup() {
          unsubscribeFromSelector();
          unsubscribeFromFinal();
        };
      },
    };
  };
}
