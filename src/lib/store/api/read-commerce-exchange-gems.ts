import { api } from ".";
import { selectGw2Url } from "./selectors";

import type { Scope } from "../../types/token";

const scopes: Scope[] = [];

export interface ReadCommerceExchangeGemsQueryArguments {
  /** The amount of gems to exchange for coins */
  gems: number;
}

export interface GemsExchangeRate {
  /** The number of coins you get for a single gem. */
  coins_per_gem: number;
  /** The number of coins you get for the specified quantity of gems. */
  quantity: number;
}

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCommerceExchangeGems: build.query<
        GemsExchangeRate,
        ReadCommerceExchangeGemsQueryArguments
      >({
        extraOptions: {
          baseUrl: selectGw2Url,
          scope: scopes,
        },
        query(queryArguments) {
          return {
            params: { quantity: queryArguments.gems },
            url: "/v2/commerce/exchange/gems",
            validateStatus(response, body) {
              return (
                response.status === 200 &&
                typeof body?.coins_per_gem === "number" &&
                typeof body?.quantity === "number"
              );
            },
          };
        },
      }),
    };
  },
});

export const readCommerceExchangeGems = injectedApi.endpoints.readCommerceExchangeGems;
