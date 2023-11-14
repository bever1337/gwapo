import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";

import { api } from "./api";
import { slice } from "./slice";
import { uiSlice } from "./ui/slice";

export const getStore = () =>
  configureStore({
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware()
        .prepend(createListenerMiddleware().middleware)
        .concat(api.middleware);
    },
    reducer: combineReducers({
      [api.reducerPath]: api.reducer,
      [slice.name]: slice.reducer,
      [uiSlice.name]: uiSlice.reducer,
    }),
  });
