import { createSlice } from "@reduxjs/toolkit";
import type { CombinedState } from "@reduxjs/toolkit/dist/query";

import { initialState } from "./initial-state";

export const slice = createSlice({
  initialState,
  name: "client",
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    hydrate(state, action: { payload: CombinedState<any, any, "cache"> }) {},
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-explicit-any */
    login(state, action: { payload: { access_token: string } }) {
      state.access_token = action.payload.access_token;
    },
    logout(state) {
      state.access_token = null;
    },
    nextOrigin(
      state,
      {
        payload: { gw2_url, gwapo_edge_url },
      }: { payload: { gw2_url?: null | string; gwapo_edge_url?: null | string } }
    ) {
      state.gw2_url = typeof gw2_url === "string" ? gw2_url : state.gw2_url;
      state.gwapo_edge_url =
        typeof gwapo_edge_url === "string" ? gwapo_edge_url : state.gwapo_edge_url;
    },
  },
});

export const hydrate = slice.actions.hydrate;
export const login = slice.actions.login;
export const logout = slice.actions.logout;
export const nextOrigin = slice.actions.nextOrigin;
