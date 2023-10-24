<script lang="ts">
	import { storeCtx } from '$lib/context.js';
	import { intl } from '$lib/intl/index.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';
	import { readCommerceExchangeGems } from '$lib/store/api/read-commerce-exchange-gems.js';
	import type { GemsExchangeRate } from '$lib/store/api/read-commerce-exchange-gems.js';

	import Coins from './coins.svelte';

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

{intl.formatNumber(quantity)}
<img class="img" alt={gems?.name} src={gems?.icon} />
=>
<Coins copper={data.quantity} />
<br />
@<Coins copper={data.coins_per_gem} />

<style>
	.img {
		height: 1.25em;
		width: 1.25em;
	}
</style>
