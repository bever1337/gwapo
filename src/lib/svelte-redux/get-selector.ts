/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selector } from '@reduxjs/toolkit';
import { derived, writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

import { createSvelteReduxContext } from './context';
import { svelteReduxContextKey } from './default-context';

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
	const storeContext = createSvelteReduxContext<AppState>(context);
	return function getSelector<Result, Parameters extends readonly any[] = any[]>(
		selector: Selector<AppState, Result, Parameters>,
		parameters?: Parameters
	) {
		const store$ = storeContext.get();
		const parameters$ = writable(parameters);
		const selector$ = derived([store$, parameters$], function callSelector([state, parameters]) {
			return selector(state, ...parameters);
		});
		return {
			reselect: parameters$.set,
			subscribe: selector$.subscribe,
		};
	};
}
