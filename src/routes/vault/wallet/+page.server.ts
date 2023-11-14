import { readCurrencies } from "$lib/store/api/read-currencies";
import { getStore } from "$lib/store/getStore";

export async function load() {
  const { dispatch, getState } = getStore();
  await dispatch(readCurrencies.initiate({})).unwrap();
  return getState().cache;
}
