import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { api } from "./api";
import { listenerMiddleware } from "./listener-middleware";
import { slice } from "./slice";
import { uiSlice } from "./ui/slice";

export const getStore = () =>
  configureStore({
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(api.middleware);
    },
    reducer: combineReducers({
      [api.reducerPath]: api.reducer,
      [slice.name]: slice.reducer,
      [uiSlice.name]: uiSlice.reducer,
    }),
  });
