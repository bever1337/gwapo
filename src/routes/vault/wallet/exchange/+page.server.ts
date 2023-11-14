import type { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query";
import { readCommerceExchangeCoins } from "$lib/store/api/read-commerce-exchange-coints";
import { readCommerceExchangeGems } from "$lib/store/api/read-commerce-exchange-gems";
import { readCurrencies } from "$lib/store/api/read-currencies";
import { getStore } from "$lib/store/getStore";

import { GEMS, GEMS_INPUT, GOLD, GOLD_INPUT } from "./constants";

function noop() {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safelyUnwrap = (result: QueryActionCreatorResult<any>) => result.unwrap().catch(noop);

export async function load() {
  const { dispatch, getState } = getStore();
  const tasks: Promise<unknown>[] = [
    dispatch(readCurrencies.initiate({})).unwrap(),
    ...GEMS.concat([GEMS_INPUT])
      .map((gems) => dispatch(readCommerceExchangeGems.initiate({ gems })))
      .map(safelyUnwrap),
    ...GOLD.concat([GOLD_INPUT])
      .map((coins) => dispatch(readCommerceExchangeCoins.initiate({ coins: coins * 10000 })))
      .map(safelyUnwrap),
  ];
  await Promise.all(tasks);
  return getState().cache;
}
