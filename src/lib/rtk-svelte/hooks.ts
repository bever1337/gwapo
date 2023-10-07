/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiEndpointQuery, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';

import type { SvelteStore } from './index';

export const useQuery =
	<QueryArgs, ResultType>(
		endpoint: ApiEndpointQuery<QueryDefinition<QueryArgs, any, any, ResultType, 'cache'>, any>
	) =>
	(localStore: SvelteStore<any>) =>
	(queryArguments: QueryArgs): Readable<ReturnType<ReturnType<(typeof endpoint)['select']>>> => {
		const inner = derived(localStore, endpoint.select(queryArguments));
		return {
			subscribe(run) {
				const unsubscriptions = [
					inner.subscribe(run),
					localStore.dispatch(endpoint.initiate(queryArguments)).unsubscribe
				];
				return function cleanup() {
					unsubscriptions.forEach((unsubscription) => {
						unsubscription();
					});
				};
			}
		};
	};
