import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { getDispatch, getSelector } from '$lib/svelte-redux';
import type { GetSelector } from '$lib/svelte-redux';

import { api } from './api';
import { listenerMiddleware } from './listener-middleware';
import { slice } from './slice';
import { uiSlice } from './ui/slice';

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	[slice.name]: slice.reducer,
	[uiSlice.name]: uiSlice.reducer,
});

export const getStore = () =>
	configureStore({
		middleware(getDefaultMiddleware) {
			return getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(api.middleware);
		},
		reducer: rootReducer,
	});

export type Store = ReturnType<typeof getStore>;
export type AppDispatch = ReturnType<typeof getStore>['dispatch'];
export type RootState = ReturnType<ReturnType<typeof getStore>['getState']>;

export const getAppDispatch = getDispatch as () => AppDispatch;
export const getAppSelector = getSelector as GetSelector<RootState>;
