<script lang="ts">
	import { storeCtx } from '$lib/context.js';
	import { intl } from '$lib/intl/index.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';
	import { readCommerceExchangeCoins } from '$lib/store/api/read-commerce-exchange-coints.js';
	import type { CoinsExchangeRate } from '$lib/store/api/read-commerce-exchange-coints.js';

	import Coins from './coins.svelte';

	export let quantity: number;

	const initialState: CoinsExchangeRate = {
		coins_per_gem: 0,
		quantity: 0
	};

	const store = storeCtx.get();
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	const getExchangeCoinsStore = useQuery(readCommerceExchangeCoins)(store);

	$: ({ data: currencies } = $readCurrenciesStore);
	$: coins = currencies?.entities[1];
	$: gems = currencies?.entities[4];

	$: readCommerceExchangeCoinsStore = getExchangeCoinsStore({ coins: quantity * 10000 });
	$: ({ data = initialState } = $readCommerceExchangeCoinsStore);
</script>

{intl.formatNumber(quantity)}
<img class="img" alt={coins?.name} src={coins?.icon} />
=>
{data?.quantity ?? 0}
<img class="img" alt={gems?.name} src={gems?.icon} />
<br />
@<Coins copper={data.coins_per_gem} />

<style>
	.img {
		height: 1.25em;
		width: 1.25em;
	}
</style>
