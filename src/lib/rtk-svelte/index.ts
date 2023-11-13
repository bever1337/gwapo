/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selector, Store } from '@reduxjs/toolkit';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Readable } from 'svelte/store';

/** @internal */
export const SvelteReduxContextKey = Symbol('SvelteReduxContext');

export type SvelteStore<T extends Store> = Readable<ReturnType<T['getState']>> & {
	dispatch: T['dispatch'];
	getState: T['getState'];
};

/**
 * @example Retrieve the store from context
 * ```ts
 * getSvelteReduxContext().dispatch({ type: "example" });
 * ```
 *
 * @example Save the store to context
 * ```ts
 * getSvelteReduxContext().set(store);
 * ```
 *
 * @example **Warning: Advanced**
 * ```ts
 * const storeBContext = Symbol();
 * getSvelteReduxContext().set(store); // the 'default' store
 * getSvelteReduxContext(storeBContext).set(storeB); // an additonal store
 * getSvelteReduxContext(storeBContext).dispatch({ type: "example" }); // dispatch to the additional store
 * ```
 */
export const getSvelteReduxContext = <S extends Store>(context = SvelteReduxContextKey) => ({
	get(): SvelteStore<S> {
		return getContext(context);
	},
	set(store: SvelteStore<S>) {
		return setContext(context, store);
	}
});

/** The simplest agreement of the Svelte store contract and a Redux store */
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

export const getDispatch = (context = SvelteReduxContextKey) =>
	getSvelteReduxContext(context).get().dispatch;

export const getSelector = <State, Result, Parameters extends readonly any[] = any[]>(
	selector: Selector<State, Result, Parameters>,
	parameters?: Parameters,
	context = SvelteReduxContextKey
) => {
	const store$ = getSvelteReduxContext(context).get();
	const parameters$ = writable(parameters);
	const selector$ = derived([store$, parameters$], function callSelector([state, parameters]) {
		return selector(state, ...parameters);
	});
	return {
		reselect: parameters$.set,
		subscribe: selector$.subscribe
	};
};
