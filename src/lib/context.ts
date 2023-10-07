// import { bindReduxStore, typeContext } from './context';
import { getSvelteReduxContext, toSvelteStore } from './rtk-svelte';
import { getStore } from './store';
import type { Store } from './store';

export const getSvelteStore = () => toSvelteStore(getStore());

export const storeCtx = getSvelteReduxContext<Store>();
