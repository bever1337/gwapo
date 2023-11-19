import { loginThunk } from "$lib/store/actions/session";
import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCurrencies } from "$lib/store/api/read-currencies";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();
  const access_token = cookies.get("access_token");

  return Promise.all([
    dispatch(readCurrencies.initiate({})).unwrap(),
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
