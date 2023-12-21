import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { readAccountWallet } from "$lib/store/api/read-account-wallet";
import { readCurrencies } from "$lib/store/api/read-currencies";
import { nextOrigin } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

export function load({ cookies, fetch, url }) {
  const { dispatch, getState } = getStore(undefined, fetch);
  dispatch(nextOrigin({ gw2_url: "https://api.guildwars2.com", gwapo_edge_url: url.origin }));

  return Promise.all([
    dispatch(readCurrencies.initiate({ langTag: "en" })),
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
