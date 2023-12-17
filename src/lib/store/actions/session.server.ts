import { createAsyncThunk } from "@reduxjs/toolkit";

import { login, logout } from "$lib/store/api/slice";
import { readAccount } from "../api/read-account";
import { readTokenInfo } from "$lib/store/api/read-token-info";

export const addUserContext = createAsyncThunk(
  "client/addUserContext",
  function ({ access_token }: { access_token: unknown }, { dispatch }) {
    if (typeof access_token !== "string" || access_token.length === 0) {
      dispatch(logout());
      return Promise.resolve(false);
    }

    dispatch(login({ access_token }));

    return Promise.all([
      dispatch(readTokenInfo.initiate({ access_token })).unwrap(),
      dispatch(readAccount.initiate({})).unwrap(),
    ])
      .then(() => true)
      .catch(() => false);
  }
);
