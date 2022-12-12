import { createSelector } from "@reduxjs/toolkit";
// import { skipToken } from "@reduxjs/toolkit/dist/query";

import type { RootState } from ".";
import { initialState } from "./slice";

import type { Scope } from "../../types/token";

const selectClient = (state: RootState) => state?.client ?? initialState;

export const makeSelectIsInScope = (scopes: Scope[]) =>
  createSelector(selectClient, (substate) =>
    scopes.every(
      (scope) => substate.access?.permissions.includes(scope) ?? false
    )
  );
