import type { Store } from '@reduxjs/toolkit';
import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';

export const SvelteReduxContextKey = Symbol('SvelteReduxContext');

export type SvelteStore<T extends Store> = Readable<ReturnType<T['getState']>> & {
	dispatch: T['dispatch'];
	getState: T['getState'];
};

export const getSvelteReduxContext = <S extends Store>() => ({
	get(): SvelteStore<S> {
		return getContext(SvelteReduxContextKey);
	},
	set(store: SvelteStore<S>) {
		return setContext(SvelteReduxContextKey, store);
	}
});

export const toSvelteStore = <T extends Store>(store: T): SvelteStore<T> => ({
	subscribe(run) {
		run(store.getState());
		const unsubscribe = store.subscribe(() => {
			run(store.getState());
		});
		return unsubscribe;
	},
	dispatch: store.dispatch,
	getState: store.getState
});
