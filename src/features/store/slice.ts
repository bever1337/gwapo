import { createSlice } from "@reduxjs/toolkit";

// Slice imports API, thus API and Endpoints may never import Slice
import { readTokenInfo } from "./api/read-token-info";
import { initialState } from "./initial-state";

export const slice = createSlice({
  initialState,
  name: "client",
  reducers: {
    logout(state) {
      state.access = null;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(readTokenInfo.matchFulfilled, (state, action) => {
      state.access = {
        ...action.payload,
        access_token: action.meta.arg.originalArgs.access_token,
      };
    });
    builder.addMatcher(readTokenInfo.matchRejected, (state, action) => {
      state.access = null;
    });
  },
});

export const logout = slice.actions.logout;
