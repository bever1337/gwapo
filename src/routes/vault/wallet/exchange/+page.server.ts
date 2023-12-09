import type { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query";

import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCommerceExchangeCoins } from "$lib/store/api/read-commerce-exchange-coints";
import { readCommerceExchangeGems } from "$lib/store/api/read-commerce-exchange-gems";
import { readCurrencies } from "$lib/store/api/read-currencies.server";
import { login } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

import { GEMS, GEMS_INPUT, GOLD, GOLD_INPUT } from "./constants";

function noop() {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safelyUnwrap = (result: QueryActionCreatorResult<any>) => result.unwrap().catch(noop);

export function load({ cookies }) {
  const { dispatch, getState } = getStore();

  return Promise.all([
    dispatch(readCurrencies.initiate({ langTag: "en" })).unwrap(),

    ...GEMS.concat([GEMS_INPUT])
      .map((gems) => dispatch(readCommerceExchangeGems.initiate({ gems })))
      .map(safelyUnwrap),

    ...GOLD.concat([GOLD_INPUT])
      .map((coins) => dispatch(readCommerceExchangeCoins.initiate({ coins: coins * 10000 })))
      .map(safelyUnwrap),

    new Promise<void>((resolve, reject) => {
      try {
        const access_token = cookies.get("access_token");

        if (typeof access_token !== "string" || access_token.length === 0) {
          cookies.delete("access_token", { path: "/" });
          return resolve();
        }

        dispatch(login({ access_token }));

        dispatch(readAccountWallet.initiate({}))
          .unwrap()
          .catch(() => {})
          .then(() => {
            resolve();
          });
      } catch (unknownError) {
        reject(unknownError);
      }
    }),
  ])
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
