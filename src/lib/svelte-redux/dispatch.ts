/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch } from 'redux';
import type { Action, AnyAction } from '@reduxjs/toolkit';

import { createSvelteReduxContext, svelteReduxContextKey } from './context';
import type { SvelteStore } from './store';

export function createGetDispatch<AppState = unknown, AppAction extends Action = AnyAction>(
	context = svelteReduxContextKey
) {
	const storeContext = createSvelteReduxContext<AppState, AppAction>(context);
	return function getDispatch<
		AppDispatch extends Dispatch<AppAction> = Dispatch<AppAction>
	>(): AppDispatch {
		const store$: SvelteStore<AppState, AppAction> = storeContext.get();
		return store$.dispatch as AppDispatch;
	};
}
