import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./initial-state";

export const slice = createSlice({
  initialState,
  name: "client",
  reducers: {
    login(state, action: { payload: { access_token: string } }) {
      state.access_token = action.payload.access_token;
    },
    logout(state) {
      state.access_token = null;
    },
  },
});

export const login = slice.actions.login;
export const logout = slice.actions.logout;
