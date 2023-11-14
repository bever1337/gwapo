import type { AppDispatch, RootState } from "$lib/store";
import { svelteReduxContext } from "$lib/svelte-redux";
import type { SvelteReduxContext } from "$lib/svelte-redux";

export const storeCtx = svelteReduxContext as SvelteReduxContext<
  RootState,
  Parameters<AppDispatch>[0]
>;
