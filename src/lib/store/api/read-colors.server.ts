import { pool } from "$lib/server/pool";

import { injectedApi as api, colorsEntityAdapter } from "./read-colors";
import type { Color } from "./read-colors";

export interface GwapotColor {
  id: number;
  blue: number;
  color_name: string;
  green: number;
  red: number;
  rgb: string;
}

const gwapotToGwapo = ({ id, blue, color_name, green, red, rgb }: GwapotColor): Color => ({
  id,
  blue,
  green,
  name: color_name,
  red,
  rgb,
});

export const injectedApi = api.enhanceEndpoints({
  endpoints: {
    readColors: {
      queryFn(queryArguments) {
        return pool.connect().then((client) =>
          client
            .query({
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
ORDER BY detailed_color.perceived_lightness;`,
              values: [queryArguments.langTag, queryArguments.material],
            })
            .then((queryResult) => {
              const rowsCopy = [...queryResult.rows];
              const safeRadius = tilesToRadius(queryResult.rows.length);
              const chunks = [];
              for (let i = 0; i < safeRadius; i++) {
                const lengthForRadius = Math.max(i * 6, 1);
                const rowsChunk = rowsCopy.splice(0, lengthForRadius).sort((a, b) => a.hue - b.hue);
                chunks.push(...rowsChunk);
              }
              return {
                data: colorsEntityAdapter.setAll(
                  colorsEntityAdapter.getInitialState(),
                  chunks.map(gwapotToGwapo)
                ),
                error: undefined,
              };
            })
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

export const readColors = injectedApi.endpoints.readColors;

/** Calculate an approximate radius for a given number of tiles */
function tilesToRadius(tiles: number): number {
  let consumed = 1;
  let radius = 1;
  for (; consumed < tiles; radius++) {
    consumed += radius * 6;
  }
  return radius;
}
