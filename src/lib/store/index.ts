import { getDispatch, getSelector } from "$lib/svelte-redux";
import type { GetSelector } from "$lib/svelte-redux";
// avoid actual circular imports, only import type
import type { getStore } from "./getStore";
import type { RootState } from "./reducer";

export type Store = ReturnType<typeof getStore>;
export type AppDispatch = ReturnType<typeof getStore>["dispatch"];
export type AppAction = Parameters<AppDispatch>[0];
export type { RootState } from "./reducer";

export const getAppDispatch = getDispatch as () => AppDispatch;
export const getAppSelector = getSelector as GetSelector<RootState>;
