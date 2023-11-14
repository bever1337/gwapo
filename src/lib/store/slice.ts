import { createSlice } from "@reduxjs/toolkit";

// Slice imports API, thus API and Endpoints may never import Slice
import { readTokenInfo } from "./api/read-token-info";
import { initialState } from "./initial-state";
import { listenerMiddleware } from "./listener-middleware";

listenerMiddleware.startListening({
  matcher: readTokenInfo.matchFulfilled,
  effect(action) {
    localStorage.setItem(
      "access",
      JSON.stringify({
        ...action.payload,
        access_token: action.meta.arg.originalArgs.access_token,
      })
    );
  },
});

listenerMiddleware.startListening({
  matcher: readTokenInfo.matchRejected,
  effect() {
    localStorage.removeItem("access");
  },
});

export const slice = createSlice({
  initialState: () => {
    if (typeof localStorage === "undefined") return initialState;
    const storedAccess = localStorage.getItem("access");
    if (!storedAccess) {
      return initialState;
    }
    try {
      return { access: JSON.parse(storedAccess) } as typeof initialState;
    } catch (jsonParsingError) {
      return initialState;
    }
  },
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
    builder.addMatcher(readTokenInfo.matchRejected, (state) => {
      state.access = null;
    });
  },
});

export const logout = slice.actions.logout;
