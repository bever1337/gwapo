import { configureStore } from "@reduxjs/toolkit";

import { apiClient } from "./api-client";
import { api } from "./api";

export const store = () =>
  configureStore({
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware().concat(api.middleware);
    },
    reducer: {
      [apiClient.name]: apiClient.reducer,
      [api.reducerPath]: api.reducer,
    },
  });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof store>["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof store>["dispatch"];
