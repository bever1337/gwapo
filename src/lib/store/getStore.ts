import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";

import { api } from "./api";
import { reducer } from "./reducer";
import type { RootState } from "./reducer";

export const getStore = (preloadedState?: RootState, fetchFn?: typeof fetch) =>
  configureStore({
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({ thunk: { extraArgument: { fetchFn } } })
        .prepend(createListenerMiddleware().middleware)
        .concat(api.middleware);
    },
    preloadedState,
    reducer,
  });
