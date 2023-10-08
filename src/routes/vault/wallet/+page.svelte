<script lang="ts">
	import { storeCtx } from '$lib/context';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { hydrate } from '$lib/store/actions.js';
	import { readAccountWallet } from '$lib/store/api/read-account-wallet.js';
	import { readCurrencies } from '$lib/store/api/read-currencies';

	export let data;

	const store = storeCtx.get();
	store.dispatch(hydrate(data));
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	$: ({ data: currencies } = $readCurrenciesStore);
	const readAccountWalletStore = useQuery(readAccountWallet)(store)({});
	$: ({ data: wallet } = $readAccountWalletStore);
</script>

<a href="/">home</a>

<ol>
	{#each currencies?.ids ?? [] as currencyId}
		{@const currency = currencies?.entities[currencyId]}
		<li>
			<h3>
				{currency?.name}
				{wallet?.entities[currencyId]?.value ?? ''}
			</h3>
			<img alt={currency?.name} src={currency?.icon} />
			<p>
				{currency?.description}
			</p>
		</li>
	{/each}
</ol>
