import { api } from "$lib/store/api";
import { loginThunk } from "$lib/store/actions/session";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();
  const access_token = cookies.get("access_token");

  return new Promise((resolve) => {
    if (typeof access_token !== "string" || access_token.length === 0) {
      resolve(undefined);
      return;
    }

    dispatch(loginThunk({ access_token }))
      .unwrap()
      .catch(() => {})
      .finally(() => {
        resolve(undefined);
      });
  })
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
