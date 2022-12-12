import { createSlice } from "@reduxjs/toolkit";

import { setAccess } from "./actions";

import type { AccessToken } from "../../types/token";

// import { configureClient, resetClient } from "./actions";
// import { initialState } from "./initial-state";

export interface SliceState {
  access: AccessToken | null;
}

export const initialState: SliceState = { access: null };

/* eslint-disable no-param-reassign */
export const slice = createSlice({
  initialState,
  name: "client",
  reducers: {},
  extraReducers(builder) {
    builder.addCase(setAccess, (state, action) => {
      state.access = action.payload;
    });
  },
});
/* eslint-enable no-param-reassign */
