import { readCommerceExchangeCoins } from '$lib/store/api/read-commerce-exchange-coints';
import { readCommerceExchangeGems } from '$lib/store/api/read-commerce-exchange-gems';
import { readCurrencies } from '$lib/store/api/read-currencies';
import { getStore } from '$lib/store';

const GEMS = [2000, 1200, 800, 400];
const GOLD = [250, 100, 50, 10];
export async function load() {
	const { dispatch, getState } = getStore();
	await Promise.all([
		...GEMS.map((gems) => dispatch(readCommerceExchangeGems.initiate({ gems })).unwrap()),
		...GOLD.map((coins) =>
			dispatch(readCommerceExchangeCoins.initiate({ coins: coins * 10000 })).unwrap()
		),
		dispatch(readCurrencies.initiate({})).unwrap()
	]);
	return getState().cache;
}
