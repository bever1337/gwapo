import type { RootState } from ".";
import { initialState } from "./initial-state";

import type { Scope } from "../types/token";

export const selectClient = (state: RootState | undefined) => state?.client ?? initialState;

export const selectInScope = (state: RootState | undefined, scopes: Scope[]) => {
  const isPublicApi = scopes.length === 0;
  if (isPublicApi) {
    return true;
  }

  const clientState = selectClient(state);

  const isUnauthenticated = clientState === null || !Array.isArray(clientState.access?.permissions);
  if (isUnauthenticated) {
    return false;
  }

  const isAuthorized = scopes.every(
    (scope) => clientState.access?.permissions.includes(scope) ?? false
  );
  return isAuthorized;
};

export const makeSelectIsInScope = (scopes: Scope[]) => (state: RootState | undefined) =>
  selectInScope(state, scopes);
