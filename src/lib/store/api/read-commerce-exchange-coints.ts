import { api } from '.';

import type { Scope } from '../../types/token';

const scopes: Scope[] = [];

export interface ReadCommerceExchangeCoinsQueryArguments {
	/** The amount of coins to exchange for gems */
	coins: number;
}

export interface CoinsExchangeRate {
	/** The number of coins you required for a single gem. */
	coins_per_gem: number;
	/** The number of gems you get for the specified quantity of coins. */
	quantity: number;
}

export const injectedApi = api.injectEndpoints({
	endpoints(build) {
		return {
			readCommerceExchangeCoins: build.query<
				CoinsExchangeRate,
				ReadCommerceExchangeCoinsQueryArguments
			>({
				extraOptions: {
					baseUrl: 'https://api.guildwars2.com',
					scope: scopes
				},
				query(queryArguments) {
					return {
						params: { quantity: queryArguments.coins },
						url: '/v2/commerce/exchange/coins',
						validateStatus(response, body) {
							return (
								response.status === 200 &&
								typeof body?.coins_per_gem === 'number' &&
								typeof body?.quantity === 'number'
							);
						}
					};
				}
			})
		};
	}
});

export const readCommerceExchangeCoins = injectedApi.endpoints.readCommerceExchangeCoins;
