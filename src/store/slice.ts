import { createSlice } from "@reduxjs/toolkit";

import { setAccess } from "./actions";

import type { AccessToken } from "../types/token";

// import { configureClient, resetClient } from "./actions";
// import { initialState } from "./initial-state";

export interface SliceState {
  access: AccessToken | null;
}

export const initialState: SliceState = { access: null };

/* eslint-disable no-param-reassign */
/**
 * A flat key/value store for swc client state. Use `configureClient` and `resetClient`
 * exported from `@racepointenergy/swc/client/actions` to safely set client values.
 * Key names SHOULD be delimited by <service>$<key>, e.g. scs$origin The reducer provides
 * NO input validation. This allows developers to set arbitrary values in state.
 * @internal
 */
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
