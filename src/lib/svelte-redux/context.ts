/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action } from "@reduxjs/toolkit";
import { getContext, setContext } from "svelte";

import type { SvelteStore } from "./store";

export type SvelteReduxContextKey = symbol;
/** @internal */
export const svelteReduxContextKey: SvelteReduxContextKey = Symbol("SvelteReduxContext");

export interface SvelteReduxContext<AppState = unknown, AppAction extends Action = Action> {
  /** Prefer `getContext` and `getSelector` */
  get(): SvelteStore<AppState, AppAction>;
  set(store: SvelteStore<AppState, AppAction>): SvelteStore<AppState, AppAction>;
}

/**
 * @example **Warning: Advanced**
 * ```ts
 * import { createSvelteReduxContext } from "..";
 *
 * // identical to `const FirstSvelteReduxContext = createSvelteReduxContext();`
 * const FirstSvelteReduxContext = SvelteReduxContext;
 * FirstSvelteReduxContext.set(store); // the 'default' store
 * const SecondSvelteReduxContext = createSvelteReduxContext(Symbol());
 * SecondSvelteReduxContext.set(storeB); // an additonal store
 *
 * FirstSvelteReduxContext.get().dispatch({ type: "example" });
 * SecondSvelteReduxContext.get().dispatch({ type: "example" }); // dispatch to the additional store
 * ```
 */
export function createSvelteReduxContext<AppState = unknown, AppAction extends Action = Action>(
  context = svelteReduxContextKey
): SvelteReduxContext<AppState, AppAction> {
  return {
    get() {
      return getContext(context);
    },
    set(store) {
      return setContext(context, store);
    },
  };
}
