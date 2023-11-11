import { getSvelteReduxContext } from './rtk-svelte';
import type { Store } from './store';

export const storeCtx = getSvelteReduxContext<Store>();
