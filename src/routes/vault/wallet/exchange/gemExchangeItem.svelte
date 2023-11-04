<script lang="ts">
	import Coins from '$lib/components/coins.svelte';
	import { storeCtx } from '$lib/context.js';
	import { intl } from '$lib/intl/index.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';
	import { readCommerceExchangeGems } from '$lib/store/api/read-commerce-exchange-gems.js';
	import type { GemsExchangeRate } from '$lib/store/api/read-commerce-exchange-gems.js';

	export let quantity: number;

	const initialState: GemsExchangeRate = {
		coins_per_gem: 0,
		quantity: 0
	};

	const store = storeCtx.get();
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	const getExchangeGemsStore = useQuery(readCommerceExchangeGems)(store);

	$: ({ data: currencies } = $readCurrenciesStore);
	$: gems = currencies?.entities[4];

	$: readCommerceExchangeGemsStore = getExchangeGemsStore({ gems: quantity });
	$: ({ data = initialState } = $readCommerceExchangeGemsStore);
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
		padding: 0.25em 0.5em;
	}
</style>
