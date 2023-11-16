import type { Action } from "@reduxjs/toolkit";

import { createSvelteReduxContext, svelteReduxContextKey } from "./context";

export function createGetDispatch<AppState = unknown, AppAction extends Action = Action>(
  context = svelteReduxContextKey
) {
  const storeContext = createSvelteReduxContext<AppState, AppAction>(context);
  return function getDispatch() {
    const store$ = storeContext.get();
    return store$.dispatch;
  };
}
