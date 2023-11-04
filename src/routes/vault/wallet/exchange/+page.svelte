<script lang="ts">
	import Coins from '$lib/components/coins.svelte';
	import { storeCtx } from '$lib/context.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { hydrate } from '$lib/store/actions.js';
	import { readAccountWallet } from '$lib/store/api/read-account-wallet.js';
	import { readCommerceExchangeCoins } from '$lib/store/api/read-commerce-exchange-coints';
	import { readCommerceExchangeGems } from '$lib/store/api/read-commerce-exchange-gems';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';

	import CoinExchangeItem from './coinExchangeItem.svelte';
	import { GEMS, GOLD } from './constants';
	import GemExchangeItem from './gemExchangeItem.svelte';

	export let data;

	const store = storeCtx.get();
	store.dispatch(hydrate(data));
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	$: ({ data: currencies } = $readCurrenciesStore);
	$: coins = currencies?.entities[1];
	$: gems = currencies?.entities[4];
	const readAccountWalletStore = useQuery(readAccountWallet)(store)({});

	let inputGems: number = 25;
	const getReadCommerceExchangeGemsStore = useQuery(readCommerceExchangeGems)(store);
	$: readCommerceExchangeGemsStore = getReadCommerceExchangeGemsStore({
		gems: inputGems
	});

	let inputGold: number = 10;
	const getReadCommerceExchangeCoinsStore = useQuery(readCommerceExchangeCoins)(store);
	$: readCommerceExchangeCoinsStore = getReadCommerceExchangeCoinsStore({
		coins: inputGold * 10000
	});
</script>

<nav class="nav">
	<a class="back-link" href="/vault/wallet">
		<svg class="back-link__icon" viewBox="0 0 24 24">
			<use href="/ri/arrow-left-double-line.svg#path" />
		</svg>
		Back to your wallet
	</a>
</nav>
<main class="main main-width">
	<h2 class="header">Currency Exchange</h2>
	<section class="section">
		<h3 style="margin: 0;">Trade gems for gold</h3>
		<table class="table">
			<thead>
				<tr class="thead__tr">
					<td class="thead__tr__td td">{gems?.name}</td>
					<td class="thead__tr__td td">{coins?.name}</td>
					<td class="thead__tr__td td">{coins?.name} per {gems?.name}</td>
				</tr>
			</thead>
			<tbody>
				{#each GEMS as gemsToExchange}
					<tr class="tr"><GemExchangeItem quantity={gemsToExchange} /></tr>
				{/each}
				<tr class="tr">
					<td class="td">
						<input
							bind:value={inputGems}
							max={9999}
							min={1}
							style="max-width: 4em;"
							type="number"
						/>
						<img
							class="img"
							alt={gems?.name}
							src={gems?.icon}
							style="height: 1.25em; width:1.25em;"
						/>
						<br />
						<button
							disabled={$readAccountWalletStore.status !== 'fulfilled'}
							on:click={function onClick() {
								inputGems = Math.max(
									1,
									Math.min($readAccountWalletStore.data?.entities?.[4]?.value ?? 0, 9999)
								);
							}}
						>
							Set Max {gems?.name}s
						</button>
					</td>
					<td class="td">
						<Coins copper={$readCommerceExchangeGemsStore.data?.quantity ?? 0} />
					</td>
					<td class="td">
						<Coins copper={$readCommerceExchangeGemsStore.data?.coins_per_gem ?? 0} />
					</td>
				</tr>
			</tbody>
		</table>
	</section>
	<section class="section">
		<h3 style="margin: 0;">Trade gold for gems</h3>
		<table class="table">
			<thead>
				<tr class="thead__tr">
					<td class="thead__tr__td td">Gold</td>
					<td class="thead__tr__td td">{gems?.name}</td>
					<td class="thead__tr__td td">{coins?.name} per {gems?.name}</td>
				</tr>
			</thead>
			<tbody>
				{#each GOLD as goldToExchange}
					<tr class="tr"><CoinExchangeItem quantity={goldToExchange} /></tr>
				{/each}
				<tr class="tr">
					<td class="td">
						<input bind:value={inputGold} max={999} min={1} style="max-width: 4em;" type="number" />
						<img
							class="img"
							alt={coins?.name}
							src={coins?.icon}
							style="height: 1.25em; width:1.25em;"
						/>
						<br />
						<button
							disabled={$readAccountWalletStore.status !== 'fulfilled'}
							on:click={function onClick() {
								inputGold = Math.max(
									1,
									Math.min(
										Math.floor(($readAccountWalletStore.data?.entities?.[1]?.value ?? 0) / 10000),
										999
									)
								);
							}}
						>
							Set Max Gold
						</button>
					</td>
					<td class="td">
						{$readCommerceExchangeCoinsStore.data?.quantity ?? 0}
						<img
							class="img"
							alt={gems?.name}
							src={gems?.icon}
							style="height: 1.25em; width:1.25em;"
						/>
					</td>
					<td class="td">
						<Coins copper={$readCommerceExchangeCoinsStore.data?.coins_per_gem ?? 0} />
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</main>

<style>
	.back-link {
		color: rgb(var(--white));
	}

	.back-link__icon {
		fill: rgb(var(--white));
		height: 1.25em;
		vertical-align: text-bottom;
		width: 1.25em;
	}

	.header {
		column-span: all;
		margin: 0 0 1rem 0;
	}

	.main {
		background-color: rgb(var(--white));
		background: linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0),
				rgba(255, 255, 255, 0) 4rem,
				rgba(255, 255, 255, 0.4) 8rem,
				rgba(255, 255, 255, 0.9) 28rem,
				rgba(255, 255, 255, 1)
			),
			url('/gw2/pattern3.jpg');
		background-repeat: no-repeat;
		background-size: 100% auto;
		box-shadow: var(--elevation--2);
		box-sizing: border-box;
		columns: 2 36rem;
		padding: 1rem;
		margin: 0 auto 2rem auto;
		max-width: 75rem;
	}

	.nav {
		box-sizing: border-box;
		margin: 0 auto;
		max-width: 77rem;
		padding: 1rem;
		width: 100%;
	}

	.section {
		margin: 0 auto 1rem auto;
		max-width: 36rem;
	}

	.table {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
	}

	.td {
		padding: 0.25em 0.5em;
	}

	.thead__tr {
		background-color: rgb(var(--primary--800));
	}

	.thead__tr__td {
		color: rgb(var(--primary--50));
	}

	.tr {
		vertical-align: top;
	}

	.tr:nth-child(even) {
		background-color: rgb(var(--primary--300));
	}

	.tr:nth-child(odd) {
		background-color: rgb(var(--primary--200));
	}
</style>
