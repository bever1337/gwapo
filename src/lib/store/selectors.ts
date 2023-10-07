import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './index';
import { initialState } from './initial-state';

import type { Scope } from '../types/token';

export const selectClient = (state: RootState) => state?.client ?? initialState;

export const makeSelectIsInScope = (scopes: Scope[]) =>
	createSelector(selectClient, (substate) =>
		scopes.every((scope) => substate.access?.permissions.includes(scope) ?? false)
	);
