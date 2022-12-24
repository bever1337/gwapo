import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { api } from "./api";
import { listenerMiddleware } from "./listener-middleware";
import { slice } from "./slice";
import { uiSlice } from "./ui/slice";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [slice.name]: slice.reducer,
  [uiSlice.name]: uiSlice.reducer,
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
