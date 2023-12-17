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
              const safeRadius = tilesToPaddedRadius(queryResult.rows.length);
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

/** Calculate the number of tiles drawn for a given radius */
function radiusToTiles(radius: number) {
  if (radius <= 0) return 0;
  let tiles = 1;
  for (let i = 2; i <= radius; i++) {
    tiles += 6 * (i - 1);
  }
  return tiles;
}

/** Calculate an approximate radius for a given number of tiles */
function tilesToRadius(tiles: number) {
  let radius = 0;
  for (; tiles >= 0; radius++) {
    tiles -= 6 * radius + 1;
  }
  return radius;
}

/** Pads the radius to ensure all tiles fit */
function tilesToPaddedRadius(tiles: number) {
  const radius = tilesToRadius(tiles);
  const unpaddedTiles = radiusToTiles(radius);
  return tiles > unpaddedTiles ? radius + 1 : radius;
}
