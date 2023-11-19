import { createSelector } from "@reduxjs/toolkit";
import { api, getIsAuthorized } from ".";
import { slice } from "./slice";

import type { RootState } from "..";
import type { AccessToken, Scope } from "../../types/token";

export const selectClient = (state: RootState | undefined) =>
  state?.[slice.name] ?? slice.getInitialState();

const emptyReadTokenInfo: { data: Pick<AccessToken, "permissions"> } = {
  data: { permissions: [] },
};
const selectEmptyReadTokenInfo = () => emptyReadTokenInfo;
const makeSelectReadTokenInfo = createSelector(selectClient, ({ access_token }) =>
  access_token ? api.endpoints.readTokenInfo.select({ access_token }) : selectEmptyReadTokenInfo
);

const selectInScope = (state: RootState, scopes: Scope[]) => {
  const clientState = selectClient(state);
  const isUnauthenticated = clientState.access_token === null;
  if (isUnauthenticated) {
    return false;
  }

  const selectReadTokenInfo = makeSelectReadTokenInfo(state);
  const permissions = selectReadTokenInfo(state).data?.permissions ?? [];
  const isAuthorized = getIsAuthorized(permissions, scopes);
  return isAuthorized;
};

export const makeSelectIsInScope = (scopes: Scope[]) => (state: RootState) =>
  selectInScope(state, scopes);
