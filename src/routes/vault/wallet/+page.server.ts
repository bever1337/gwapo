import { readCurrencies } from '$lib/store/api/read-currencies';
import { getStore } from '$lib/store';

export async function load() {
	const store = getStore();
	await store.dispatch(readCurrencies.initiate({})).unwrap();
	return store.getState().cache;
}
