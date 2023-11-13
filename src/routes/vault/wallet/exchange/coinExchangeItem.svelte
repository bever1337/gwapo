<script lang="ts">
	import Coins from '$lib/components/coins.svelte';
	import { intl } from '$lib/intl/index.js';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';
	import { readCommerceExchangeCoins } from '$lib/store/api/read-commerce-exchange-coints.js';
	import type { CoinsExchangeRate } from '$lib/store/api/read-commerce-exchange-coints.js';

	export let quantity: number;

	const initialState: CoinsExchangeRate = {
		coins_per_gem: 0,
		quantity: 0
	};

	const readCurrencies$ = readCurrencies.query({});
	$: ({ data: currencies } = $readCurrencies$);
	$: coins = currencies?.entities[1];
	$: gems = currencies?.entities[4];

	const readCommerceExchangeCoins$ = readCommerceExchangeCoins.query({ coins: quantity * 10000 });
	$: readCommerceExchangeCoins$.next({ coins: quantity * 10000 });
	$: ({ data = initialState } = $readCommerceExchangeCoins$);
</script>

<td class="td">
	{intl.formatNumber(quantity)}
	<img class="img" alt={coins?.name} src={coins?.icon} />
</td>
<td class="td">
	{intl.formatNumber(data?.quantity ?? 0)}
	<img class="img" alt={gems?.name} src={gems?.icon} />
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
