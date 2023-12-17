<script lang="ts">
  import { page } from "$app/stores";
  import Ngon from "$lib/components/ngon.svelte";
  import { getAppDispatch } from "$lib/store";
  import { hydrateThunk } from "$lib/store/actions/hydrate";
  import { readColors } from "$lib/store/api/read-colors";

  export let data;

  const dispatch = getAppDispatch();
  dispatch(hydrateThunk(data.cache));

  const readColors$ = readColors.query({ langTag: "en", material: "cloth" });
  $: ({ data: colors } = $readColors$);

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

  function collectHexagonCenterPoints(radius: number): [cx: number, cy: number][] {
    const centerPoints: [number, number][] = [[0, 0]];
    for (let i = 0; i < radius; i++) {
      /** Center-to-center distance between two hexagons */
      const distance = 100;
      let [xN, yN]: [xN: number, yN: number] = [-1 * i * distance, 0];
      let [translateX, translateY]: [translateX: number, translateY: number] = [
        distance / 2,
        (-1 * distance * Math.sqrt(3)) / 2,
      ];
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < i; k++) {
          xN += translateX;
          yN += translateY;
          centerPoints.push([xN, yN]);
        }
        [translateX, translateY] = [
          Math.cos(Math.PI / 3) * translateX - Math.sin(Math.PI / 3) * translateY, // Negate sin term for clockwise rotation
          Math.sin(Math.PI / 3) * translateX + Math.cos(Math.PI / 3) * translateY, // Negate cos term for clockwise rotation
        ];
      }
    }
    return centerPoints;
  }

  $: radius = tilesToPaddedRadius(colors?.ids.length ?? 0);
  function toSearchUrl(originalUrl: URL, id: number): string {
    const nextUrl = new URL(originalUrl);
    nextUrl.searchParams.set("id", `${id}`);
    return nextUrl.toString();
  }

  $: height = radius * 100 * Math.sqrt(3);
  $: width = radius * 200;
</script>

<svg viewBox={`${-1 * (width / 2)} ${-1 * (height / 2)} ${width} ${height}`}>
  {#each collectHexagonCenterPoints(radius) as [cx, cy], index}
    {@const colorId = colors?.ids[index] ?? 0}
    {@const color = colors?.entities[colorId]}
    {#if color}
      <a href={toSearchUrl($page.url, colorId)}>
        <Ngon
          {cx}
          {cy}
          id={colorId}
          diameter={100}
          fill={`#${color?.rgb ?? "000000"}`}
          stroke={`#${color?.rgb ?? "000000"}`}
          stroke-dasharray={4}
          stroke-width={2}
          strokeWidth={4}
          vertices={6}
        />
      </a>
    {/if}
  {/each}
</svg>
