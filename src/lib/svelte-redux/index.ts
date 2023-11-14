import { createSvelteReduxContext } from "./context";
export type { SvelteReduxContext, SvelteReduxContextKey } from "./context";
import { createGetDispatch } from "./dispatch";
import { createGetSelector } from "./selector";
export type { GetSelector } from "./selector";
export { toSvelteStore } from "./store";
export type { SvelteStore } from "./store";

/**
 *
 * @example
 * Save the store to context
 * ```ts
 * svelteReduxContext.set(store);
 * ```
 *
 * @example
 * Type the store context
 * ```ts
 * const storeCtx = svelteReduxContext as SvelteReduxContext<
 *  RootState, Parameters<AppDispatch>[0]
 * >;
 * ```
 */
export const svelteReduxContext = createSvelteReduxContext();

/**
 * @example
 * Basic use
 * ```ts
 * const dispatch = getDispatch();
 * dispatch({ type: "example" });
 * ```
 *
 * @example
 * typing dispatch
 * ```ts
 * // src/store.ts
 * export const getAppDispatch = getDispatch as () => AppDispatch;
 * ```
 *
 * ```svelte
 * <!-- src/component.svelte -->
 * <script lang="ts">
 *   import { getAppDispatch } from './store';
 *   const dispatch = getAppDispatch();
 *   dispatch({ type: "example" });
 * </script>
 * ```
 */
export const getDispatch = createGetDispatch();

/**
 * @example
 * Basic usage
 * ```svelte
 * <script lang="ts">
 *  const userName$ = getSelector((state) => state.user.name)
 * </script>
 *
 * <h1>hello, {$userName$}</h1>
 * ```
 *
 * @example
 * Dynamic parameters
 * ```svelte
 * <script lang="ts">
 *  const userSelector = (state, userId) => state.users[userId];
 *  let userIdInput = "";
 *  const user$ = getSelector(userSelector, userIdInput);
 *  $: user$.reselect(userIdInput);
 * </script>
 *
 * <input bind:value={userIdInput} type="text" />
 * {#if $user$}
 *  <p>found {$user$?.name}</p>
 * {/if}
 * ```
 *
 * @example
 * Typing getSelector
 * ```ts
 * export const getAppSelector = getSelector as GetSelector<RootState>;
 * ```
 */
export const getSelector = createGetSelector();
