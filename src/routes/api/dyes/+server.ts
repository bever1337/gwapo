import { pool } from "$lib/server/pool";
import { colorsEntityAdapter } from "$lib/store/api/read-colors";
import type { Color } from "$lib/store/api/read-colors";

import { paramToString, tilesToRadius } from "../../vault/dyes/common";

export interface GwapotColor {
  id: number;
  color_name: string;
  red: number;
  green: number;
  blue: number;
  rgb: string;
  perceived_lightness: number;
  hue: number;
}

const gwapotToGwapo = ({ id, blue, color_name, green, red, rgb }: GwapotColor): Color => ({
  id,
  blue,
  green,
  name: color_name,
  red,
  rgb,
});

const preparedColorsQuery = ({
  langTag,
  material,
  where_hue,
  where_material,
  where_rarity,
}: {
  /** Relates named_color */
  langTag: string;
  /** Relates detailed_color */
  material: string;
  /** Relates color.hue */
  where_hue: null | string;
  /** Relates color.material */
  where_material: null | string;
  /** Relates color.rarity */
  where_rarity: null | string;
}) => ({
  name: "readColors",
  text: `SELECT color.id,
named_color.color_name,
detailed_color.red,
detailed_color.green,
detailed_color.blue,
detailed_color.rgb,
detailed_color.perceived_lightness,
detailed_color.hue
FROM
gwapese.colors AS color
INNER JOIN
gwapese.named_colors AS named_color ON named_color.id = color.id
AND named_color.language_tag = $1
INNER JOIN
gwapese.detailed_colors as detailed_color ON detailed_color.id = color.id
AND detailed_color.material = $2
WHERE
($3::text IS NULL OR color.hue = $3::text)
AND ($4::text IS NULL OR color.material = $4::text)
AND ($5::text IS NULL OR color.rarity = $5::text)
ORDER BY detailed_color.perceived_lightness;`,
  values: [langTag, material, where_hue, where_material, where_rarity],
});

export function GET({ url }) {
  return pool.connect().then((client) =>
    client
      .query<GwapotColor>(
        preparedColorsQuery({
          langTag: paramToString(url.searchParams.get("langTag"))!,
          material: paramToString(url.searchParams.get("material"))!,
          where_hue: paramToString(url.searchParams.get("where_hue")),
          where_material: paramToString(url.searchParams.get("where_material")),
          where_rarity: paramToString(url.searchParams.get("where_rarity")),
        })
      )
      .then((queryResult) => {
        const rowsCopy = [...queryResult.rows];
        const safeRadius = tilesToRadius(queryResult.rows.length);
        const chunks = [];
        for (let i = 0; i < safeRadius; i++) {
          const lengthForRadius = Math.max(i * 6, 1);
          const rowsChunk = rowsCopy.splice(0, lengthForRadius).sort((a, b) => a.hue - b.hue);
          chunks.push(...rowsChunk);
        }

        return new Response(
          JSON.stringify(
            colorsEntityAdapter.setAll(
              colorsEntityAdapter.getInitialState(),
              chunks.map(gwapotToGwapo)
            )
          )
        );
      })
      .finally(() => {
        client.release();
      })
  );
}
