import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { nextOrigin } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

export function load({ cookies, fetch, url }) {
  const { dispatch, getState } = getStore(undefined, fetch);
  dispatch(nextOrigin({ gw2_url: "https://api.guildwars2.com", gwapo_edge_url: url.origin }));

  return dispatch(addUserContext({ access_token: cookies.get("access_token") }))
    .unwrap()
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
