/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Store } from '@reduxjs/toolkit';
import type { Readable } from 'svelte/store';

export interface SvelteStore<AppState = unknown, AppAction extends Action = Action> {
	dispatch: Store<AppState, AppAction>['dispatch'];
	getState: Store<AppState, AppAction>['getState'];
	subscribe: Readable<AppState>['subscribe'];
}

/** The simplest agreement of the Svelte store contract and a Redux store */
export const toSvelteStore = <AppState, AppAction extends Action>(
	store: Store<AppState, AppAction>
): SvelteStore<AppState, AppAction> => ({
	subscribe(run) {
		run(store.getState());
		const unsubscribe = store.subscribe(function storeSubscriber() {
			run(store.getState());
		});
		return unsubscribe;
	},
	dispatch: store.dispatch,
	getState: store.getState,
});
