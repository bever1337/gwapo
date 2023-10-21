<script context="module" lang="ts">
	import UFuzzy from '@leeoniya/ufuzzy';
	import type { Currency, ReadCurrenciesResult } from '$lib/store/api/read-currencies';

	const uFuzzy = new UFuzzy();
	const emptyArray: any[] = [];
	function filterCurrencies(needle: string, currencies?: ReadCurrenciesResult): Currency['id'][] {
		if (!currencies) {
			return emptyArray;
		}

		const isNeedle = typeof needle === 'string' && needle.length > 0;
		if (!isNeedle) {
			return currencies?.ids ?? emptyArray;
		}
		const haystack =
			currencies?.ids.map((currencyId) => currencies!.entities[currencyId].name) ?? emptyArray;
		const currencyIndices: number[] = uFuzzy.search(haystack, needle)[0] ?? emptyArray;
		const currencyIds =
			currencyIndices.map((currencyIndex) => currencies!.ids[currencyIndex]) ?? emptyArray;
		return currencyIds;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { storeCtx } from '$lib/context.js';
	import { intl } from '$lib/intl/index.js';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { hydrate } from '$lib/store/actions.js';
	import { readAccountWallet } from '$lib/store/api/read-account-wallet.js';
	import { readCurrencies } from '$lib/store/api/read-currencies.js';
	import { separateCopperCoins } from '$lib/types/currency.js';

	export let data;

	const store = storeCtx.get();
	store.dispatch(hydrate(data));
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	$: ({ data: currencies } = $readCurrenciesStore);
	const readAccountWalletStore = useQuery(readAccountWallet)(store)({});
	$: ({ data: wallet, status: readWalletStatus } = $readAccountWalletStore);

	let needle = '';
	let filteredCurrencies: Currency['id'][] = [];
	$: filteredCurrencies = filterCurrencies(needle, currencies);

	let selected: number[] = [];
	let expandAllSelected: boolean;
	$: expandAllSelected = selected.length === (currencies?.ids.length ?? 0);

	function onReset() {
		needle = '';
		selected = [];
	}

	function onChangeExpandAllCurrencies(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (event.currentTarget?.checked) {
			selected = [...(currencies?.ids ?? [])];
		} else {
			selected = [];
		}
	}
</script>

<div class="banner">
	<img alt="A pile of coins" class="banner__img" src={`/Currency_Exchange_banner.jpg`} />
	<h1 class="banner__header">Wallet</h1>
</div>
<form class="currencies" on:reset={onReset}>
	<nav class="currencies__nav">
		<label class="currencies__nav__filter">
			<img
				alt=""
				aria-hidden="true"
				class="currencies__nav__filter__icon"
				src="/ri/search-line.svg"
			/>
			<span class="hide">Search currencies</span>
			<input
				bind:value={needle}
				class="currencies__nav__filter__input touch-area"
				disabled={!browser}
				name="filterCurrencies"
				placeholder="Search"
				type="search"
			/>
		</label>
		<button class="currencies__nav__reset touch-area" disabled={!browser} type="reset">
			<span class="hide">Reset</span>
			<img alt="filter" src={`/ri/filter-off-fill.svg`} />
		</button>
		<label class="currencies__nav__expand-all">
			<span class="hide">Expand all</span>
			<input
				checked={expandAllSelected}
				class="hide"
				disabled={!browser}
				name="expandAllCurrencies"
				on:change={onChangeExpandAllCurrencies}
				type="checkbox"
			/>
			<img alt="" class="checkbox-icon--up touch-area" src="/ri/arrow-up-s-line.svg" />
			<img alt="" class="checkbox-icon--down touch-area" src="/ri/arrow-down-s-line.svg" />
		</label>
	</nav>
	<div class="currencies__span" />
	<ol class="currencies__list">
		{#each filteredCurrencies as currencyId}
			{@const currency = currencies?.entities[currencyId]}
			<li class="currencies__list__item">
				<div class="currency__picture">
					<div class="currency__picture__border" />
					<img alt={currency?.name} class="currency__picture__img" src={currency?.icon} />
				</div>
				<label class="currency__name" for={`controlCurrency${currencyId}`}>
					{currency?.name}
				</label>
				<input
					bind:group={selected}
					class="hide"
					id={`controlCurrency${currencyId}`}
					name={`controlCurrency${currencyId}`}
					type="checkbox"
					value={currencyId}
				/>
				<label class="currency__control" for={`controlCurrency${currencyId}`}>
					<img alt="" class="checkbox-icon--up touch-area" src="/ri/arrow-up-s-line.svg" />
					<img alt="" class="checkbox-icon--down touch-area" src="/ri/arrow-down-s-line.svg" />
				</label>
				<p class="currency__wallet">
					{#if readWalletStatus === 'fulfilled'}
						{#if currency?.id === 1}
							{@const [gold, silver, copper] = separateCopperCoins(
								wallet?.entities[currencyId]?.value ?? 0
							)}
							{intl.formatNumber(gold)}<img
								alt=""
								aria-hidden="true"
								class="currency--coin__img"
								src="/gw2/gold_coin.png"
							/>
							{`${silver}`}<img
								alt=""
								aria-hidden="true"
								class="currency--coin__img"
								src="/gw2/silver_coin.png"
							/>
							{`${copper}`}<img
								alt=""
								aria-hidden="true"
								class="currency--coin__img"
								src="/gw2/copper_coin.png"
							/>
						{:else}
							{intl.formatNumber(wallet?.entities[currencyId]?.value ?? 0)}
						{/if}
					{:else if readWalletStatus === 'rejected'}
						{'?'}
					{:else}
						{'\u00a0'}
					{/if}
				</p>
				<p class="currency__description">
					{currency?.description}
				</p>
			</li>
		{/each}
	</ol>
</form>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".07" numOctaves="4" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="4" />
		</filter>
	</defs>
</svg>

<style>
	.banner {
		background-color: #071530;
		line-height: 0;
		overflow: hidden;
		position: relative;
	}

	.banner__header {
		bottom: 0;
		color: white;
		text-shadow: 2px 1px 8px rgba(0, 0, 0, 0.75);
		font-size: 5rem;
		line-height: 1em;
		margin: 0;
		padding: 1rem 2rem;
		position: absolute;
		z-index: 1;
	}

	.banner__img {
		filter: blur(0.05vw);
		height: 33vh;
		max-height: 24rem;
		max-width: 80rem;
		min-height: 12rem;
		object-fit: cover;
		object-position: 50% 66%;
		position: relative;
		width: 100%;
	}

	.banner:after {
		content: ' ';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: block;
		background: linear-gradient(to right, rgba(0, 0, 0, 0) 72rem, rgba(6, 18, 43, 1) 80rem);
	}

	.currencies {
		column-gap: 1rem;
		columns: 6 25rem;
		list-style: none;
		padding: 0;
	}

	.currencies__list {
		display: contents;
	}

	.currencies__list__item {
		align-items: center;
		border-radius: 0.25rem;
		box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.6);
		break-inside: avoid;
		display: grid;
		grid-template:
			'img header control' auto
			'img wallet wallet' auto
			'description description description' auto / auto 1fr auto;
		margin: 0 0 1rem 0;
		padding: 0.5rem;
	}

	.currencies__nav {
		border-radius: 0.25rem;
		box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.6);
		break-inside: avoid;
		display: flex;
		flex-flow: row nowrap;
		padding: 0.5rem;
		margin: 1rem 0;
	}

	.currencies__nav__expand-all {
		margin-left: auto;
	}

	.currencies__nav__filter {
		display: contents;
	}

	.currencies__nav__filter__icon {
		align-self: center;
		height: 1.75rem;
		width: 1.75rem;
	}

	.currencies__nav__filter__input {
		font-size: 1.25rem;
		max-width: 16em;
		padding: 0.125rem 0.5rem;
	}

	.currencies__nav__reset {
		margin: 0 1em;
	}

	.currencies__span {
		column-span: all;
		margin: 0 0 1rem 0;
	}

	.currency--coin__img {
		height: 1.7rem;
		margin-right: 1ch;
		vertical-align: text-bottom;
		width: 1.7rem;
	}

	.currency__control {
		align-self: start;
		grid-area: control;
	}

	.currency__description {
		border-top: 1px solid rgba(0, 0, 0, 0.4);
		grid-area: description;
		padding: 1rem 0.5rem 0.5rem 0.5rem;
		margin: 0.5em 0 0 0;
	}

	.currency__name {
		font-size: 1.17rem;
		font-weight: normal;
		grid-area: header;
		margin: 0.5rem 0.5rem 0.25rem 1rem;
	}

	.currency__picture {
		display: inline-block;
		grid-area: img;
		height: calc(4rem + 4px);
		position: relative;
		width: calc(4rem + 4px);
	}

	.currency__picture__border {
		border: 3px solid rgba(0, 0, 0, 0.9);
		background: rgba(0, 0, 0, 0.9);
		display: inline-block;
		filter: url(#squiggle);
		height: 4rem;
		position: absolute;
		width: 4rem;
	}

	.currency__picture__img {
		filter: drop-shadow(4px 3px 10px rgba(255, 255, 255, 0.5));
		height: 4rem;
		left: 3px;
		position: absolute;
		top: 3px;
		width: 4rem;
	}

	.currency__wallet {
		align-self: center;
		font-size: 1.5rem;
		grid-area: wallet;
		margin: 0 0.5rem 0.25rem 1rem;
	}

	.hide {
		position: absolute;
		display: block;
		height: 1px;
		width: 1px;
		left: -10000px;
		right: -10000px;
		word-break: normal !important;
		overflow: hidden;
	}

	.touch-area {
		min-height: 2.75rem;
		min-width: 2.75rem;
	}

	/* begin checkbox/form-control selectors */

	*:checked ~ .checkbox-icon--up,
	*:checked ~ .currency__control > .checkbox-icon--up,
	*:not(checked) ~ .checkbox-icon--down,
	*:not(checked) ~ .currency__control > .checkbox-icon--down,
	*:not(checked) ~ .currency__description {
		display: none;
	}

	*:checked ~ .checkbox-icon--down,
	*:checked ~ .currency__control > .checkbox-icon--down,
	*:not(checked) ~ .checkbox-icon--up,
	*:not(checked) ~ .currency__control > .checkbox-icon--up,
	*:checked ~ .currency__description {
		display: block;
	}
</style>
