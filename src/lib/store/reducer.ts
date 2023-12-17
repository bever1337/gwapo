import { combineReducers } from "@reduxjs/toolkit";

import { api } from "./api";
import { slice } from "./api/slice";
import { uiSlice } from "./ui/slice";

export const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [slice.name]: slice.reducer,
  [uiSlice.name]: uiSlice.reducer,
});

export type RootState = ReturnType<typeof reducer>;
