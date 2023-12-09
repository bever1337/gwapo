import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCurrencies } from "$lib/store/api/read-currencies.server";
import { login } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();

  return Promise.all([
    dispatch(readCurrencies.initiate({ langTag: "en" })).unwrap(),
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
