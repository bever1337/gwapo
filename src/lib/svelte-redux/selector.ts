/* eslint-disable @typescript-eslint/no-explicit-any */
import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";

import { createSvelteReduxContext, svelteReduxContextKey } from "./context";

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
    const parameters$ = writable(parameters);
    const selector$ = derived([store$, parameters$], function callSelector([state, parameters]) {
      return selector(state, ...parameters);
    });
    return {
      reselect(...parameters: Parameters) {
        parameters$.set(parameters);
      },
      subscribe: selector$.subscribe,
    };
  };
}
