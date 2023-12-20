import { injectedApi as api } from "./read-dye-categories";

import { pool } from "$lib/server/pool";

export const injectedApi = api.enhanceEndpoints({
  endpoints: {
    readDyeCategories: {
      queryFn() {
        return pool.connect().then((client) =>
          Promise.all([
            client.query<{ hue: string }>({
              name: "readDyeHueCategories",
              text: `SELECT hue FROM gwapese.color_hue_categories;`,
            }),
            client.query<{ material: string }>({
              name: "readDyeMaterialCategories",
              text: `SELECT material FROM gwapese.color_material_categories;`,
            }),
            client.query<{ rarity: string }>({
              name: "readDyeRarityCategories",
              text: `SELECT rarity FROM gwapese.color_rarity_categories;`,
            }),
          ])
            .then(([hueCategories, materialCategories, rarityCategories]) => ({
              data: {
                hue: hueCategories.rows.map((row) => row.hue),
                material: materialCategories.rows.map((row) => row.material),
                rarity: rarityCategories.rows.map((row) => row.rarity),
              },
            }))
            .catch((reason) => ({
              data: undefined,
              error: {
                error: (reason?.toString?.() as string | undefined) ?? `${reason}`,
                status: "CUSTOM_ERROR" as const,
              },
            }))
            .finally(() => {
              client.release();
            })
        );
      },
    },
  },
});

export const readDyeCategories = injectedApi.endpoints.readDyeCategories;
