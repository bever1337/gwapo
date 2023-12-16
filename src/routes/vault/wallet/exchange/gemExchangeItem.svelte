<script lang="ts">
  import Coins from "$lib/components/coins.svelte";
  import { intl } from "$lib/intl/index.js";
  import { readCurrencies } from "$lib/store/api/read-currencies.js";
  import { readCommerceExchangeGems } from "$lib/store/api/read-commerce-exchange-gems.js";
  import type { GemsExchangeRate } from "$lib/store/api/read-commerce-exchange-gems.js";

  export let quantity: number;

  const initialState: GemsExchangeRate = {
    coins_per_gem: 0,
    quantity: 0,
  };

  const readCurrencies$ = readCurrencies.query({ langTag: "en" });
  $: ({ data: currencies } = $readCurrencies$);
  $: gems = currencies?.entities[4];

  const readCommerceExchangeGems$ = readCommerceExchangeGems.query({ gems: quantity });
  $: readCommerceExchangeGems$.next({ gems: quantity });
  $: ({ data = initialState } = $readCommerceExchangeGems$);
</script>

<td class="td">
  {intl.formatNumber(quantity)}
  <img class="img" alt={gems?.name} src={gems?.icon} />
</td>
<td class="td">
  <Coins copper={data.quantity} />
</td>
<td class="td">
  <Coins copper={data.coins_per_gem} />
</td>

<style>
  .img {
    height: 1.25em;
    vertical-align: text-bottom;
    width: 1.25em;
  }

  .td {
    font-family: PTSans, sans-serif;
    font-size: 1.125rem;
    padding: 0.25rem 1rem;
    text-align: right;
  }
</style>
