/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Store } from "@reduxjs/toolkit";
import type { Readable } from "svelte/store";

export interface SvelteStore<AppStore extends Store> {
  dispatch: AppStore["dispatch"];
  getState: AppStore["getState"];
  subscribe: Readable<ReturnType<AppStore["getState"]>>["subscribe"];
}

/** The simplest agreement of the Svelte store contract and a Redux store */
export const toSvelteStore = <
  AppState = unknown,
  AppAction extends Action = Action,
  AppStore extends Store = Store<AppState, AppAction>
>(
  store: AppStore
): SvelteStore<AppStore> => ({
  subscribe(run) {
    run(store.getState());
    const unsubscribe = store.subscribe(function storeSubscriber() {
      run(store.getState());
    });
    return unsubscribe;
  },
  dispatch: store.dispatch,
  getState: store.getState,
});
