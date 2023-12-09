import { api } from "$lib/store/api";
import { login } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

export function load({ cookies }) {
  const { dispatch, getState } = getStore();

  return new Promise<ReturnType<typeof getState>>((resolve, reject) => {
    try {
      const access_token = cookies.get("access_token");

      if (typeof access_token === "string" && access_token.length > 0) {
        dispatch(login({ access_token }));
      } else {
        cookies.delete("access_token", { path: "/" });
      }

      resolve(getState());

      dispatch(api.util.resetApiState());
    } catch (unknownError) {
      reject(unknownError);
    }
  });
}
