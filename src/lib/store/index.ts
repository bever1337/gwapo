import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { getDispatch, getSelector } from '$lib/svelte-redux';
import type { TypedGetSelector } from '$lib/svelte-redux';

import { api } from './api';
import { listenerMiddleware } from './listener-middleware';
import { slice } from './slice';
import { uiSlice } from './ui/slice';

export const getStore = () =>
	configureStore({
		middleware(getDefaultMiddleware) {
			return getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(api.middleware);
		},
		reducer: combineReducers({
			[api.reducerPath]: api.reducer,
			[slice.name]: slice.reducer,
			[uiSlice.name]: uiSlice.reducer,
		}),
	});

export type Store = ReturnType<typeof getStore>;
export type AppDispatch = ReturnType<typeof getStore>['dispatch'];
export type AppAction = Parameters<AppDispatch>[0];
export type RootState = ReturnType<ReturnType<typeof getStore>['getState']>;

export const getAppDispatch: () => AppDispatch = getDispatch;
export const getAppSelector: TypedGetSelector<RootState> = getSelector;
