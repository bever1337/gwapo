import { createSlice } from "@reduxjs/toolkit";

// Slice imports API, thus API and Endpoints may never import Slice
import { readTokenInfo } from "./api/read-token-info";

import type { AccessToken } from "../../types/token";

export interface SliceState {
  access: AccessToken | null;
}

export const initialState: SliceState = { access: null };

export const slice = createSlice({
  initialState,
  name: "client",
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(readTokenInfo.matchFulfilled, (state, action) => {
      state.access = {
        ...action.payload,
        id: action.meta.arg.originalArgs.access_token,
      };
    });
  },
});
