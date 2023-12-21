import { addUserContext } from "$lib/store/actions/session.server";
import { api } from "$lib/store/api";
import { readColors } from "$lib/store/api/read-colors";
import { readDyeCategories } from "$lib/store/api/read-dye-categories";
import { nextOrigin } from "$lib/store/api/slice";
import { getStore } from "$lib/store/getStore";

import { paramToString } from "./common";

export async function load({ cookies, fetch, url }) {
  const { dispatch, getState } = getStore(undefined, fetch);
  dispatch(nextOrigin({ gw2_url: "https://api.guildwars2.com", gwapo_edge_url: url.origin }));
  return Promise.all([
    dispatch(addUserContext({ access_token: cookies.get("access_token") })),
    dispatch(
      readColors.initiate({
        langTag: "en",
        material: "cloth",
        where: [
          paramToString(url.searchParams.get("hue")),
          paramToString(url.searchParams.get("material")),
          paramToString(url.searchParams.get("rarity")),
        ],
      })
    ),
    dispatch(readDyeCategories.initiate({})),
  ])
    .then(() => getState())
    .finally(() => {
      dispatch(api.util.resetApiState());
    });
}
