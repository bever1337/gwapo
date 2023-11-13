/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Store } from '@reduxjs/toolkit';
import type { Readable } from 'svelte/store';

export interface SvelteStore<T extends Store> {
	dispatch: T['dispatch'];
	getState: T['getState'];
	subscribe: Readable<ReturnType<T['getState']>>['subscribe'];
}

/** The simplest agreement of the Svelte store contract and a Redux store */
export const toSvelteStore = <AppState = unknown, AppAction extends Action = Action>(
	store: Store<AppState, AppAction>
): SvelteStore<Store<AppState, AppAction>> => ({
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
