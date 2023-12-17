import { createSelector } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/query";

import { readTokenInfo } from "./read-token-info";
import { slice } from "./slice";

import type { RootState } from "../reducer";
import type { Scope } from "../../types/token";

export const selectClient = (state: RootState | undefined) =>
  state?.[slice.name] ?? slice.getInitialState();

const makeSelectReadTokenInfo = createSelector(selectClient, ({ access_token }) =>
  readTokenInfo.select(access_token ? { access_token: access_token } : skipToken)
);

const selectReadTokenInfo = (state: RootState) => makeSelectReadTokenInfo(state)(state);

const selectInScope = (state: RootState, scopes?: Scope[]) => {
  const isPublicApi = (scopes?.length ?? 0) === 0;
  if (isPublicApi) {
    return true;
  }

  const clientState = selectClient(state);
  const isUnauthenticated = clientState.access_token === null;
  if (isUnauthenticated) {
    return false;
  }

  const permissions = selectReadTokenInfo(state).data?.permissions ?? [];
  const isAuthorized =
    permissions.length >= 1 && scopes!.every((scope) => permissions.includes(scope));
  return isAuthorized;
};

export const makeSelectIsInScope = (scopes: Scope[]) => (state: RootState) =>
  selectInScope(state, scopes);
