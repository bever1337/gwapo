import { createSlice } from "@reduxjs/toolkit";

// import { configureClient, resetClient } from "./actions";
// import { initialState } from "./initial-state";

/* eslint-disable no-param-reassign */
/**
 * A flat key/value store for swc client state. Use `configureClient` and `resetClient`
 * exported from `@racepointenergy/swc/client/actions` to safely set client values.
 * Key names SHOULD be delimited by <service>$<key>, e.g. scs$origin The reducer provides
 * NO input validation. This allows developers to set arbitrary values in state.
 * @internal
 */
export const apiClient = createSlice({
  initialState: {},
  name: "client",
  reducers: {},
  extraReducers(builder) {},
});
/* eslint-enable no-param-reassign */
