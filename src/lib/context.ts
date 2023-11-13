import { getDispatch, getSelector, svelteReduxContext } from './svelte-redux';
import type { GetSelector, SvelteReduxContext } from './svelte-redux';
import type { RootState, AppDispatch } from './store';

export const storeCtx = svelteReduxContext as SvelteReduxContext<
	RootState,
	Parameters<AppDispatch>[0]
>;

export const getAppDispatch = getDispatch as () => AppDispatch;

export const getAppSelector = getSelector as GetSelector<RootState>;
