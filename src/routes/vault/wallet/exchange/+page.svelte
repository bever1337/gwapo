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
<main class="main">
	<h1 class="header--1">Currency Exchange</h1>
	<section class="section">
		<h2 class="header--2">Trade gems for gold</h2>
		<table class="table">
			<thead>
				<tr class="thead__tr">
					<td class="thead__tr__td td" width="20%">{gems?.name}</td>
					<td class="thead__tr__td td" width="45%">{coins?.name}</td>
					<td class="thead__tr__td td" width="35%">{coins?.name} per {gems?.name}</td>
				</tr>
			</thead>
			<tbody>
				{#each GEMS as gemsToExchange}
					<tr class="tr"><GemExchangeItem quantity={gemsToExchange} /></tr>
				{/each}
				<tr class="tr">
					<td class="td">
						<input bind:value={inputGems} class="input" max={9999} min={1} type="number" />
					</td>
					<td class="td">
						<Coins copper={$readCommerceExchangeGemsStore.data?.quantity ?? 0} />
					</td>
					<td class="td">
						<Coins copper={$readCommerceExchangeGemsStore.data?.coins_per_gem ?? 0} />
					</td>
				</tr>
				<tr class="tr">
					<td class="td--max td--max--gems" colspan="3">
						<button
							class="button"
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
				</tr>
			</tbody>
		</table>
	</section>
	<section class="section">
		<h2 class="header--2">Trade gold for gems</h2>
		<table class="table">
			<thead>
				<tr class="thead__tr">
					<td class="thead__tr__td td" width="20%">Gold</td>
					<td class="thead__tr__td td" width="45%">{gems?.name}</td>
					<td class="thead__tr__td td" width="35%">{coins?.name} per {gems?.name}</td>
				</tr>
			</thead>
			<tbody>
				{#each GOLD as goldToExchange}
					<tr class="tr"><CoinExchangeItem quantity={goldToExchange} /></tr>
				{/each}
				<tr class="tr">
					<td class="td">
						<input bind:value={inputGold} class="input" max={999} min={1} type="number" />
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
				<tr class="tr">
					<td class="td--max td--max--gold" colspan="3">
						<button
							class="button"
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
				</tr>
			</tbody>
		</table>
	</section>
</main>

<style>
	.back-link {
		font-family: PTSerif, serif;
		color: rgb(var(--white));
	}

	.back-link__icon {
		fill: rgb(var(--white));
		height: 1.25em;
		vertical-align: text-bottom;
		width: 1.25em;
	}

	.button {
		box-shadow: var(--elevation--1);
		font-family: PTSerif, serif;
		font-size: 1.125rem;
		min-height: 2.75rem;
		min-width: 2.75rem;
	}

	.header--1 {
		color: rgb(var(--primary--200));
		text-shadow: 2px 2px 4px rgb(var(--black));
		column-span: all;
		font-family: PTSerif, serif;
		font-weight: normal;
		margin: 0 0 1rem 0;
	}

	.header--2 {
		color: rgb(var(--primary--200));
		font-family: PTSerif, serif;
		font-weight: normal;
		text-shadow: 1px 1px 3px rgb(var(--black));
		margin: 0;
	}

	.img {
		height: 1.25rem;
		vertical-align: text-bottom;
		width: 1.25rem;
	}

	.input {
		font-family: PTSans, sans-serif;
		font-size: 1.125rem;
		max-width: 7ch;
		text-align: right;
	}

	.main {
		background: radial-gradient(ellipse at 33% 10%, rgba(6, 20, 50, 0), rgb(3, 10, 25) 20rem),
			url('/gw2/Currency_Exchange_banner.jpg');
		background-color: rgb(3, 10, 25);
		background-repeat: no-repeat;
		background-size: 60rem auto;
		box-shadow: var(--elevation--2);
		box-sizing: border-box;
		columns: 2 36rem;
		column-gap: 2rem;
		justify-self: start;
		padding: 2rem;
		margin: 0 auto 4rem auto;
		max-width: 90rem;
	}

	.nav {
		box-sizing: border-box;
		margin: 0 auto;
		max-width: 77rem;
		padding: 2rem 1rem 1rem 1rem;
		width: 100%;
	}

	.section {
		margin: 0 auto 2rem auto;
		max-width: 36rem;
	}

	.table {
		border-collapse: collapse;
		box-shadow: var(--elevation--2);
		table-layout: fixed;
		width: 100%;
	}

	.td {
		font-family: PTSans, sans-serif;
		font-size: 1.125rem;
		padding: 0.25rem 1rem;
		text-align: right;
	}

	.td--max {
		padding: 1rem 0.5rem 0.5rem 0.5rem;
		text-align: center;
	}

	.td--max--gems {
		background: radial-gradient(
			ellipse at bottom,
			rgb(var(--white) / 0.2),
			rgb(var(--black) / 0.3)
		);
		background-color: #549cfa;
	}

	.td--max--gold {
		background: radial-gradient(
			ellipse at bottom,
			rgb(var(--white) / 0.2),
			rgb(var(--black) / 0.3)
		);
		background-color: #f5ce55;
	}

	.thead__tr {
		background-color: rgb(var(--primary--800));
	}

	.thead__tr__td {
		color: rgb(var(--primary--50));
		font-family: PTSerif, serif;
		font-size: 1.125rem;
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
