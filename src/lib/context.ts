import { getDispatch, getSelector, SvelteReduxContext } from './rtk-svelte';
import type { GetSelector, SvelteReduxContextImplementation } from './rtk-svelte';
import type { RootState, AppDispatch } from './store';

export const storeCtx = SvelteReduxContext as SvelteReduxContextImplementation<
	RootState,
	Parameters<AppDispatch>[0]
>;

export const getAppDispatch = getDispatch as () => AppDispatch;

export const getAppSelector = getSelector as GetSelector<RootState>;
