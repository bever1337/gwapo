/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, Selector, Store } from '@reduxjs/toolkit';
import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { Readable } from 'svelte/motion';

export type SvelteReduxContextKey = symbol;
/** @internal */
export const svelteReduxContextKey: SvelteReduxContextKey = Symbol('SvelteReduxContext');

export type SvelteStore<T extends Store> = Readable<ReturnType<T['getState']>> & {
	dispatch: T['dispatch'];
	getState: T['getState'];
};

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
	getState: store.getState
});

export interface SvelteReduxContextImplementation<
	AppState = unknown,
	AppAction extends Action = Action
> {
	get(): SvelteStore<Store<AppState, AppAction>>;
	set(store: SvelteStore<Store<AppState, AppAction>>): void;
}
/**
 * @example **Warning: Advanced**
 * ```ts
 * import { createSvelteReduxContext } from "..";
 *
 * // identical to `const FirstSvelteReduxContext = createSvelteReduxContext();`
 * const FirstSvelteReduxContext = SvelteReduxContext;
 * FirstSvelteReduxContext.set(store); // the 'default' store
 * const SecondSvelteReduxContext = createSvelteReduxContext(Symbol());
 * SecondSvelteReduxContext.set(storeB); // an additonal store
 *
 * FirstSvelteReduxContext.get().dispatch({ type: "example" });
 * SecondSvelteReduxContext.get().dispatch({ type: "example" }); // dispatch to the additional store
 * ```
 */
export const createSvelteReduxContext = <AppState = unknown, AppAction extends Action = Action>(
	context = svelteReduxContextKey
): SvelteReduxContextImplementation<AppState, AppAction> => ({
	get() {
		return getContext(context);
	},
	set(store) {
		return setContext(context, store);
	}
});

/**
 *
 * @example Save the store to context
 * ```ts
 * SvelteReduxContext.set(store);
 * ```
 *
 * @example Retrieve the store from context
 * ```ts
 * const store = SvelteReduxContext.get();
 * store.dispatch({ type: "example" });
 * ```
 */
export const SvelteReduxContext = createSvelteReduxContext();

export function createGetDispatch<AppState = unknown, AppAction extends Action = Action>(
	context = svelteReduxContextKey
) {
	return function getDispatch() {
		const store$: SvelteStore<Store<AppState, AppAction>> = createSvelteReduxContext<
			AppState,
			AppAction
		>(context).get();
		return store$.dispatch;
	};
}

export const getDispatch = createGetDispatch();

export interface GetSelector<AppState> {
	<Result, Parameters extends readonly any[] = any[]>(
		selector: Selector<AppState, Result, Parameters>,
		parameters?: Parameters
	): {
		reselect(parameters: Parameters): void;
		subscribe: Readable<Result>['subscribe'];
	};
}

export function createGetSelector<AppState>(
	context = svelteReduxContextKey
): GetSelector<AppState> {
	return function getSelector<Result, Parameters extends readonly any[] = any[]>(
		selector: Selector<AppState, Result, Parameters>,
		parameters?: Parameters
	) {
		const store$: SvelteStore<Store<AppState>> = createSvelteReduxContext<AppState>(context).get();
		const parameters$ = writable(parameters);
		const selector$ = derived([store$, parameters$], function callSelector([state, parameters]) {
			return selector(state, ...parameters);
		});
		return {
			reselect: parameters$.set,
			subscribe: selector$.subscribe
		};
	};
}

export const getSelector = createGetSelector();
