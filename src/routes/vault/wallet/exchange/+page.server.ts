import type { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query";

import { loginThunk } from "$lib/store/actions/session";
import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCommerceExchangeCoins } from "$lib/store/api/read-commerce-exchange-coints";
import { readCommerceExchangeGems } from "$lib/store/api/read-commerce-exchange-gems";
import { readCurrencies } from "$lib/store/api/read-currencies";
import { getStore } from "$lib/store/getStore";

import { GEMS, GEMS_INPUT, GOLD, GOLD_INPUT } from "./constants";

function noop() {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safelyUnwrap = (result: QueryActionCreatorResult<any>) => result.unwrap().catch(noop);

export async function load({ cookies }) {
  const { dispatch, getState } = getStore();
  const access_token = cookies.get("access_token");

  return Promise.all([
    dispatch(readCurrencies.initiate({})).unwrap(),

    ...GEMS.concat([GEMS_INPUT])
      .map((gems) => dispatch(readCommerceExchangeGems.initiate({ gems })))
      .map(safelyUnwrap),

    ...GOLD.concat([GOLD_INPUT])
      .map((coins) => dispatch(readCommerceExchangeCoins.initiate({ coins: coins * 10000 })))
      .map(safelyUnwrap),

    new Promise((resolve) => {
      if (typeof access_token !== "string" || access_token.length === 0) {
        resolve(undefined);
        return;
      }

      dispatch(loginThunk({ access_token }))
        .unwrap()
        .then(() => dispatch(readAccountWallet.initiate({})).unwrap())
        .catch(() => {})
        .finally(() => {
          resolve(undefined);
        });
    }),
  ])
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
