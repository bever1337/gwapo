<script lang="ts">
  import { intl } from "$lib/intl/index.js";
  import { separateCopperCoins } from "$lib/types/currency.js";

  export let copper: number;

  $: [goldOut, silverOut, copperOut] = separateCopperCoins(copper);
</script>

{#if goldOut > 0}
  {intl.formatNumber(goldOut)}
  <img alt="gold" class="img" height="64" src="/gw2/gold_coin.png" width="64" />
{/if}
{#if silverOut > 0 || goldOut > 0}
  {intl.formatNumber(silverOut)}
  <img alt="silver" class="img" height="64" src="/gw2/silver_coin.png" width="64" />
{/if}
{intl.formatNumber(copperOut)}
<img alt="copper" class="img img--last" height="64" src="/gw2/copper_coin.png" width="64" />

<style>
  .img {
    height: 1.25em;
    margin: 0 1ch 0 0;
    vertical-align: text-bottom;
    width: 1.25em;
  }

  .img--last {
    margin: 0;
  }
</style>
