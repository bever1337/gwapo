import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();

  return dispatch(addUserContext({ access_token: cookies.get("access_token") }))
    .unwrap()
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
