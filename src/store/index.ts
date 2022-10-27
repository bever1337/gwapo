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
        .prepend([listenerMiddleware.middleware])
        .concat([api.middleware]);
    },
    reducer: rootReducer,
  });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof store>["dispatch"];
