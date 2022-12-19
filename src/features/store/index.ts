import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { slice } from "./slice";
import { api } from "./api";
import { listenerMiddleware } from "./listener-middleware";

const rootReducer = combineReducers({
  [slice.name]: slice.reducer,
  [api.reducerPath]: api.reducer,
});

export const store = () =>
  configureStore({
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(api.middleware);
    },
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof store>["dispatch"];
