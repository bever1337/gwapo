import { createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "../api";
import { readTokenInfo } from "../api/read-token-info";
import { login, logout } from "../api/slice";

export const loginThunk = createAsyncThunk(
  "loginThunk",
  ({ access_token }: { access_token: string }, { dispatch }) => {
    const readTokenInfoResultSubscription = dispatch(readTokenInfo.initiate({ access_token }));
    return readTokenInfoResultSubscription
      .unwrap()
      .then((readTokenInfoResult) => {
        dispatch(login({ access_token }));
        return readTokenInfoResult;
      })
      .catch(() => {
        dispatch(logoutThunk({}));
        return null;
      })
      .then((authResult) => {
        dispatch(api.util.invalidateTags([{ type: "access_token", id: access_token }]));
        return authResult;
      })
      .finally(() => {
        readTokenInfoResultSubscription.unsubscribe();
      });
  }
);

export const logoutThunk = createAsyncThunk(
  "logoutThunk",
  (thunkArguments: Record<string, never>, { dispatch }) => {
    // clear state BEFORE invalidating tags
    // if these actions are reversed, then the invalidated queries still have access to the expiring token
    const logoutResult = dispatch(logout());
    dispatch(api.util.invalidateTags([{ type: "access_token", id: "LIST" }]));
    return logoutResult;
  }
);
