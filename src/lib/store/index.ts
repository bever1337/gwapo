import { getDispatch, getSelector } from "$lib/svelte-redux";
import type { TypedGetSelector } from "$lib/svelte-redux";
// avoid actual circular imports, only import type
import type { getStore } from "./getStore";

export type Store = ReturnType<typeof getStore>;
export type AppDispatch = ReturnType<typeof getStore>["dispatch"];
export type AppAction = Parameters<AppDispatch>[0];
export type RootState = ReturnType<ReturnType<typeof getStore>["getState"]>;

export const getAppDispatch: () => AppDispatch = getDispatch;
export const getAppSelector: TypedGetSelector<RootState> = getSelector;
