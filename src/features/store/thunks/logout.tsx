import type { Action, ThunkAction } from "@reduxjs/toolkit";

import type { RootState } from "..";
import { api } from "../api";
import { logout } from "../slice";

const invalidatedTagsAction = () =>
  api.util.invalidateTags([{ type: "access_token" as const, id: "LIST" }]);

export const logoutThunk: ThunkAction<
  undefined,
  RootState,
  undefined,
  Action<any>
> = (dispatch) => {
  // clear state BEFORE invalidating tags
  // if these actions are reversed, then the invalidated queries still have access to the expiring token
  dispatch(logout());
  dispatch(invalidatedTagsAction());
  return undefined;
};
