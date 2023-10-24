<script lang="ts">
	import { browser } from '$app/environment';
	import { storeCtx } from '$lib/context.js';
	import { intl } from '$lib/intl/index.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { hydrate } from '$lib/store/actions.js';
	import { readAccountWallet } from '$lib/store/api/read-account-wallet.js';
	import { CurrencyCategory, readCurrencies } from '$lib/store/api/read-currencies.js';
	import { readCommerceExchangeCoins } from '$lib/store/api/read-commerce-exchange-coints.js';
	import { readCommerceExchangeGems } from '$lib/store/api/read-commerce-exchange-gems.js';
	import { separateCopperCoins } from '$lib/types/currency.js';

	const store = storeCtx.get();
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	const readAccountWalletStore = useQuery(readAccountWallet)(store)({});
	const getExchangeCoinsStore = useQuery(readCommerceExchangeCoins)(store);
	const getExchangeGemsStore = useQuery(readCommerceExchangeGems)(store);

	$: ({ data: currencies } = $readCurrenciesStore);
	$: coins = currencies?.entities[1];
	$: gems = currencies?.entities[4];
	$: ({ data: wallet, status: readWalletStatus } = $readAccountWalletStore);

	const readCommerceExchange2000GemsStore = getExchangeGemsStore({ gems: 2000 });
	$: ({ data: readCommerceExchange2000Gems } = $readCommerceExchange2000GemsStore);
	const readCommerceExchange1200GemsStore = getExchangeGemsStore({ gems: 1200 });
	$: ({ data: readCommerceExchange1200Gems } = $readCommerceExchange1200GemsStore);
	const readCommerceExchange800GemsStore = getExchangeGemsStore({ gems: 800 });
	$: ({ data: readCommerceExchange800Gems } = $readCommerceExchange800GemsStore);
	const readCommerceExchange400GemsStore = getExchangeGemsStore({ gems: 400 });
	$: ({ data: readCommerceExchange400Gems } = $readCommerceExchange400GemsStore);

	const readCommerceExchange250GoldStore = getExchangeCoinsStore({ coins: 250 * 10000 });
	$: ({ data: readCommerceExchange250Gold } = $readCommerceExchange250GoldStore);
	const readCommerceExchange100GoldStore = getExchangeCoinsStore({ coins: 100 * 10000 });
	$: ({ data: readCommerceExchange100Gold } = $readCommerceExchange100GoldStore);
	const readCommerceExchange50GoldStore = getExchangeCoinsStore({ coins: 50 * 10000 });
	$: ({ data: readCommerceExchange50Gold } = $readCommerceExchange50GoldStore);
	const readCommerceExchange10GoldStore = getExchangeCoinsStore({ coins: 10 * 10000 });
	$: ({ data: readCommerceExchange10Gold } = $readCommerceExchange10GoldStore);
	const readCommerceExchange1GoldStore = getExchangeCoinsStore({ coins: 1 * 10000 });
	$: ({ data: readCommerceExchange1Gold } = $readCommerceExchange1GoldStore);
</script>

<p>
	{intl.formatNumber(2000)}
	{gems?.name} =>
	{readCommerceExchange2000Gems?.quantity ?? 0}
	{coins?.name} @
	{readCommerceExchange2000Gems?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(1200)}
	{gems?.name} =>
	{readCommerceExchange1200Gems?.quantity ?? 0}
	{coins?.name} @
	{readCommerceExchange1200Gems?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(800)}
	{gems?.name} =>
	{readCommerceExchange800Gems?.quantity ?? 0}
	{coins?.name} @
	{readCommerceExchange800Gems?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(400)}
	{gems?.name} =>
	{readCommerceExchange400Gems?.quantity ?? 0}
	{coins?.name} @
	{readCommerceExchange400Gems?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<hr />
<p>
	{intl.formatNumber(250)}
	{coins?.name} =>
	{readCommerceExchange250Gold?.quantity ?? 0}
	{gems?.name} @
	{readCommerceExchange250Gold?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(100)}
	{coins?.name} =>
	{readCommerceExchange100Gold?.quantity ?? 0}
	{gems?.name} @
	{readCommerceExchange100Gold?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(50)}
	{coins?.name} =>
	{readCommerceExchange50Gold?.quantity ?? 0}
	{gems?.name} @
	{readCommerceExchange50Gold?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(10)}
	{coins?.name} =>
	{readCommerceExchange10Gold?.quantity ?? 0}
	{gems?.name} @
	{readCommerceExchange10Gold?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>
<p>
	{intl.formatNumber(1)}
	{coins?.name} =>
	{readCommerceExchange1Gold?.quantity ?? 0}
	{gems?.name} @
	{readCommerceExchange1Gold?.coins_per_gem ?? 0}
	{coins?.name}/{gems?.name}
</p>

<style>
</style>
