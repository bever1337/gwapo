import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { readColors } from "$lib/store/api/read-colors.server";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();

  return Promise.all([
    dispatch(addUserContext({ access_token: cookies.get("access_token") })),
    dispatch(readColors.initiate({ langTag: "en", material: "cloth" })),
  ])
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
