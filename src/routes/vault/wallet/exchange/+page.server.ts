import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCommerceExchangeCoins } from "$lib/store/api/read-commerce-exchange-coints";
import { readCommerceExchangeGems } from "$lib/store/api/read-commerce-exchange-gems";
import { readCurrencies } from "$lib/store/api/read-currencies.server";
import { getStore } from "$lib/store/getStore";

import { GEMS, GEMS_INPUT, GOLD, GOLD_INPUT } from "./constants";

export function load({ cookies, fetch }) {
  const { dispatch, getState } = getStore(undefined, fetch);

  return Promise.all([
    dispatch(readCurrencies.initiate({ langTag: "en" })),
    ...GEMS.concat([GEMS_INPUT]).map((gems) =>
      dispatch(readCommerceExchangeGems.initiate({ gems }))
    ),
    ...GOLD.concat([GOLD_INPUT]).map((coins) =>
      dispatch(readCommerceExchangeCoins.initiate({ coins: coins * 10000 }))
    ),
    dispatch(addUserContext({ access_token: cookies.get("access_token") }))
      .unwrap()
      .then((isAuthenticated): Promise<unknown> => {
        if (!isAuthenticated) {
          return Promise.resolve();
        }

        return dispatch(readAccountWallet.initiate({}));
      }),
  ])
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
