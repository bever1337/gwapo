<script lang="ts">
  import { page } from "$app/stores";
  import Ngon from "$lib/components/ngon.svelte";
  import { getAppDispatch } from "$lib/store";
  import { hydrateThunk } from "$lib/store/actions/hydrate";
  import { readColors } from "$lib/store/api/read-colors";
  import {
    initialState as initialDyeCategories,
    readDyeCategories,
  } from "$lib/store/api/read-dye-categories";

  import { collectHexagonCenterPoints, paramToString, tilesToRadius } from "./common";

  export let data;

  const dispatch = getAppDispatch();
  dispatch(hydrateThunk(data.cache));

  function toSearchUrl(originalUrl: URL, id: number): string {
    const nextUrl = new URL(originalUrl);
    nextUrl.searchParams.set("id", `${id}`);
    return nextUrl.toString();
  }

  let form: HTMLFormElement;

  let hue_category = $page.url.searchParams.get("hue") ?? "";
  let material_category = $page.url.searchParams.get("material") ?? "";
  let rarity_category = $page.url.searchParams.get("rarity") ?? "";

  const readColors$ = readColors.query({
    langTag: "en",
    material: "cloth",
    where: [
      paramToString(hue_category),
      paramToString(material_category),
      paramToString(rarity_category),
    ],
  });

  $: readColors$.next({
    langTag: "en",
    material: "cloth",
    where: [
      paramToString(hue_category),
      paramToString(material_category),
      paramToString(rarity_category),
    ],
  });
  $: ({ data: colors } = $readColors$);

  const readDyeCategories$ = readDyeCategories.query({});
  $: ({ data: { hue, material, rarity } = initialDyeCategories } = $readDyeCategories$);

  $: radius = tilesToRadius(colors?.ids.length ?? 0);
  $: height = radius * 100 * Math.sqrt(3);
  $: width = radius * 200;
</script>

<form action="/vault/dyes" bind:this={form}>
  <label>
    Hue
    <select bind:value={hue_category} name="where_hue">
      <option label="All Hues" value="" />
      {#each hue as hue_category (hue_category)}
        <option label={hue_category} value={hue_category} />
      {/each}
    </select>
  </label>
  <label>
    Material
    <select bind:value={material_category} name="where_material">
      <option label="All Materials" value="" />
      {#each material as material_category (material_category)}
        <option label={material_category} value={material_category} />
      {/each}
    </select>
  </label>
  <label>
    Rarity
    <select bind:value={rarity_category} name="where_rarity">
      <option label="All Rarities" value="" />
      {#each rarity as rarity_category (rarity_category)}
        <option label={rarity_category} value={rarity_category} />
      {/each}
    </select>
  </label>
  <label>
    Locked
    <input name="locked" type="checkbox" value="true" />
  </label>
  <input name="id" type="hidden" value={$page.url.searchParams.get("id")} />
  <button type="submit">submit</button>
</form>
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
