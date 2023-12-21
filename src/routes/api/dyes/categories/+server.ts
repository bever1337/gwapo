import { pool } from "$lib/server/pool";

export function GET() {
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
      .then(
        ([hueCategories, materialCategories, rarityCategories]) =>
          new Response(
            JSON.stringify({
              hue: hueCategories.rows.map((row) => row.hue),
              material: materialCategories.rows.map((row) => row.material),
              rarity: rarityCategories.rows.map((row) => row.rarity),
            })
          )
      )
      .finally(() => {
        client.release();
      })
  );
}
