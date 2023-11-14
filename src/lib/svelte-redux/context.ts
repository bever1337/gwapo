/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Store } from "@reduxjs/toolkit";
import { getContext, setContext } from "svelte";

import type { SvelteStore } from "./store";

export type SvelteReduxContextKey = symbol;
/** @internal */
export const svelteReduxContextKey: SvelteReduxContextKey = Symbol("SvelteReduxContext");

export interface SvelteReduxContext<
  AppState = unknown,
  AppAction extends Action = Action,
  AppStore extends Store = Store<AppState, AppAction>
> {
  /** Prefer `getContext` and `getSelector` */
  get(): SvelteStore<AppStore>;
  set(store: SvelteStore<AppStore>): SvelteStore<AppStore>;
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
export function createSvelteReduxContext<
  AppState = unknown,
  AppAction extends Action = Action,
  AppStore extends Store = Store<AppState, AppAction>
>(context = svelteReduxContextKey): SvelteReduxContext<AppState, AppAction, AppStore> {
  return {
    get() {
      return getContext(context);
    },
    set(store) {
      return setContext(context, store);
    },
  };
}
