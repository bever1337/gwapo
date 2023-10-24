<script context="module" lang="ts">
	import UFuzzy from '@leeoniya/ufuzzy';
	import type { Currency, ReadCurrenciesResult } from '$lib/store/api/read-currencies';

	const uFuzzy = new UFuzzy();
	const emptyArray: any[] = [];
	function filterCurrencies(needle: string, currencies: ReadCurrenciesResult): Currency['id'][] {
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
	import { CurrencyCategory, readCurrencies } from '$lib/store/api/read-currencies.js';
	import { separateCopperCoins } from '$lib/types/currency.js';

	import CommerceExchange from './commerceExchange.svelte';

	export let data;

	const store = storeCtx.get();
	store.dispatch(hydrate(data));
	const readCurrenciesStore = useQuery(readCurrencies)(store)({});
	$: ({ data: currencies } = $readCurrenciesStore);
	const readAccountWalletStore = useQuery(readAccountWallet)(store)({});
	$: ({ data: wallet, status: readWalletStatus } = $readAccountWalletStore);

	$: supportedCurrencies =
		currencies?.ids.filter((currencyId) => {
			const entity = currencies?.entities[currencyId];
			const walletEntity = wallet?.entities[currencyId];
			if (!entity) return false;
			const inWallet = (walletEntity?.value ?? 0) > 0;
			if (inWallet) return true;
			return entity?.deprecated !== true;
		}) ?? [];

	let category: -1 | CurrencyCategory = -1;
	$: currenciesInCategory =
		category === -1
			? supportedCurrencies
			: supportedCurrencies.filter((currencyId) => {
					const entity = currencies?.entities[currencyId];
					if (!entity) return false;
					return entity.category === category;
			  });

	let needle = '';
	$: filteredCurrencies = filterCurrencies(needle, {
		ids: currenciesInCategory,
		entities: currencies?.entities ?? {}
	});

	let selected: number[] = [];
	let expandAllSelected: boolean;
	$: expandAllSelected = selected.length === (currencies?.ids.length ?? 0);

	function onReset() {
		category = -1;
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

<main class="main">
	<h1 class="banner__header">Wallet</h1>
	<form class="currencies" action="/vault/wallet" on:reset={onReset}>
		<nav class="currencies__nav">
			<label class="currencies__nav__select">
				<select
					bind:value={category}
					class="currencies__nav__select__input touch-area"
					name="selectCurrencies"
				>
					<option value={-1} label="All Currencies" />
					<option value={CurrencyCategory.General} label="General" />
					<option value={CurrencyCategory.Competitive} label="Competitive" />
					<option value={CurrencyCategory.Instanced} label="Instanced" />
					<option value={CurrencyCategory.Keys} label="Keys" />
					<option value={CurrencyCategory.Maps} label="Maps" />
					<option value={CurrencyCategory.Activity} label="Activity" />
				</select>
			</label>
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
					name="filterCurrencies"
					placeholder="Search"
					type="search"
				/>
			</label>
			<div class="currencies__nav__control">
				<button class="currencies__nav__reset touch-area" type="reset">
					<img alt="filter" class="currencies__nav__reset__img" src="/ri/filter-off-fill.svg" />
					<span>Reset</span>
				</button>
				<button class="currencies__nav__submit touch-area" class:hide={browser} type="submit">
					<span>Search</span>
				</button>
			</div>
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
				<svg class="checkbox-icon checkbox-icon--up" viewBox="0 0 24 24">
					<use href="/ri/arrow-right-s-line.svg#path" />
				</svg>
				<svg class="checkbox-icon checkbox-icon--down" viewBox="0 0 24 24">
					<use href="/ri/arrow-down-s-line.svg#path" />
				</svg>
			</label>
		</nav>
		<ol class="currencies__list">
			{#each filteredCurrencies as currencyId, index (currencyId)}
				{@const currency = currencies?.entities[currencyId]}
				{@const previousCurrencyId = filteredCurrencies[index - 1] ?? -1}
				{@const previousCurrency = currencies?.entities[previousCurrencyId]}
				{@const currencyIsCoin = (currency?.id ?? 0) === 1}
				{@const currencyWasGem = (previousCurrency?.id ?? 0) === 4}
				{@const showConversionDialog = currencyIsCoin && currencyWasGem}
				{#if showConversionDialog}
					<li class="currencies__list__item currencies__list__item--conversion">
						<div class="currency__picture" />
						<label
							class="currency__name currency__name--conversion"
							for="controlCurrencyConversion"
						>
							Trade {previousCurrency?.name}s and {currency?.name}s!
						</label>
						<input
							class="hide"
							id="controlCurrencyConversion"
							name="controlCurrencyConversion"
							type="checkbox"
							value="conversion"
						/>
						<label
							class="currency__control currency__control--conversion"
							for="controlCurrencyConversion"
						>
							<svg class="checkbox-icon checkbox-icon--up" viewBox="0 0 24 24">
								<use href="/ri/arrow-right-s-line.svg#path" />
							</svg>
							<svg class="checkbox-icon checkbox-icon--down" viewBox="0 0 24 24">
								<use href="/ri/arrow-down-s-line.svg#path" />
							</svg>
						</label>
						<p class="currency__wallet currency__wallet--conversion">Currency Exchange</p>
						<div class="currency__description" style="background-color: goldenrod;">
							<CommerceExchange />
						</div>
					</li>
				{/if}
				<li class="currencies__list__item currencies__list__item--currency">
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
						<svg class="checkbox-icon checkbox-icon--up" viewBox="0 0 24 24">
							<use href="/ri/arrow-right-s-line.svg#path" />
						</svg>
						<svg class="checkbox-icon checkbox-icon--down" viewBox="0 0 24 24">
							<use href="/ri/arrow-down-s-line.svg#path" />
						</svg>
					</label>
					<p class="currency__wallet">
						{#if readWalletStatus === 'fulfilled'}
							{#if currencyIsCoin}
								{@const [gold, silver, copper] = separateCopperCoins(
									wallet?.entities[currencyId]?.value ?? 0
								)}
								{intl.formatNumber(gold)}<img
									alt="gold"
									class="currency__wallet__coin-img"
									src="/gw2/gold_coin.png"
								/>{`${silver}`}<img
									alt="silver"
									class="currency__wallet__coin-img"
									src="/gw2/silver_coin.png"
								/>{`${copper}`}<img
									alt="copper"
									class="currency__wallet__coin-img"
									src="/gw2/copper_coin.png"
								/>
							{:else}
								{intl.formatNumber(wallet?.entities[currencyId]?.value ?? 0)}
							{/if}
							<!-- {:else if readWalletStatus === 'rejected'} -->
							<!-- {'?'} -->
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
</main>
<svg class="hide" xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".07" numOctaves="4" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="4" />
		</filter>
	</defs>
</svg>

<style>
	.banner__header {
		color: rgb(var(--primary--900));
		margin: 0;
		padding: 1rem 1rem 0 1rem;
	}

	.currencies {
		box-sizing: border-box;
		column-gap: 1rem;
		columns: 6 24rem;
		list-style: none;
		padding: 0 1rem 1rem 1rem;
	}

	.currencies__list {
		display: contents;
	}

	.currencies__list__item {
		align-items: center;
		border-radius: 0.25rem;
		box-shadow: var(--elevation--1);
		break-inside: avoid;
		display: grid;
		grid-template:
			'img header control' auto
			'img wallet wallet' auto
			'description description description' auto / auto 1fr auto;
		list-style: none;
		margin: 0 0 1rem 0;
		padding: 0.5rem;
	}

	.currencies__list__item--currency {
		background-color: rgb(var(--primary--50));
	}

	.currencies__list__item--conversion {
		background: url('/gw2/Currency_Exchange_banner.jpg');
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: 0% 0%;
	}

	.currencies__nav {
		background-color: rgb(var(--primary--200));
		border-radius: 0.25rem;
		box-shadow: var(--elevation--1);
		break-inside: avoid;
		column-span: all;
		display: grid;
		gap: 1em;
		grid-template:
			'select toggle' auto
			'name null' auto
			'control null' auto / 1fr auto;
		justify-content: flex-start;
		padding: 0.5rem;
		margin: 0 0 1rem 0;
	}

	@media screen and (min-width: 42rem) {
		.currencies__nav {
			grid-template:
				'select name toggle' auto
				'control control null' auto / 16rem 16rem 1fr;
		}
	}

	@media screen and (min-width: 56rem) {
		.currencies__nav {
			grid-template: 'select name control toggle' auto / 16rem 16rem auto 1fr;
		}
	}

	.currencies__nav__control {
		align-items: center;
		display: flex;
		grid-area: control;
		justify-content: space-between;
		max-width: 16rem;
	}

	.currencies__nav__expand-all {
		grid-area: toggle;
		margin-left: auto;
	}

	.currencies__nav__filter {
		align-items: center;
		background-color: rgb(var(--primary--50));
		border: 1px solid rgb(var(--primary--900));
		border-radius: 0.25rem;
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		grid-area: name;
		max-width: 16rem;
		padding: 0 0 0 0.5rem;
		width: 100%;
	}

	.currencies__nav__filter:focus-within {
		background-color: rgb(var(--white));
		outline: 2px solid royalblue;
	}

	.currencies__nav__filter__icon {
		height: 1.75rem;
		width: 1.75rem;
	}

	.currencies__nav__filter__input {
		background-color: transparent;
		border: 0 solid transparent;
		font-size: 1.25rem;
		padding: 0.25rem;
		width: 100%;
	}

	.currencies__nav__filter__input:focus {
		outline: none;
	}

	.currencies__nav__reset {
		justify-self: flex-start;
	}

	.currencies__nav__reset__img {
		height: 1.75rem;
		width: 1.75rem;
	}

	.currencies__nav__select {
		display: contents;
	}

	.currencies__nav__select__input {
		box-sizing: border-box;
		font-size: 1.25rem;
		grid-area: select;
		max-width: 16rem;
		padding: 0.125rem 1rem 0.125rem 0.5rem;
	}

	.currencies__nav__submit {
		animation: 4s linear 0s 1 fadeIn;
		background-color: rgb(var(--primary--900));
		border: 1px solid rgb(var(--primary--700));
		border-radius: 0.25em;
		box-shadow: var(--elevation--1);
		color: rgb(var(--primary--50));
		font-size: 1.25rem;
		opacity: 1;
		padding: 0.25rem 1rem;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		99% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@media screen and (min-width: 56rem) {
		.currencies__nav__submit {
			margin: 0 1rem;
		}
	}

	.currency__control {
		align-self: start;
		grid-area: control;
	}

	.currency__control--conversion {
		fill: white;
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

	.currency__name--conversion {
		color: rgb(var(--primary--50));
		text-shadow: 2px 2px 4px rgb(var(--black));
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

	.currency__wallet--conversion {
		color: rgb(var(--primary--50));
		text-shadow: 1px 1px 3px rgb(var(--black));
	}

	.currency__wallet__coin-img {
		height: 1.5rem;
		margin: 0 1ch 0 0.25ch;
		vertical-align: text-bottom;
		width: 1.5rem;
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

	.checkbox-icon {
		height: 2.75rem;
		width: 2.75rem;
	}

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

	.main {
		background: white;
		background: linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0),
				rgba(255, 255, 255, 0) 8rem,
				rgba(255, 255, 255, 0.4) 16rem,
				rgba(255, 255, 255, 0.9) 32rem,
				rgba(255, 255, 255, 1)
			),
			url('/gw2/pattern3.jpg');
		background-repeat: no-repeat;
		background-size: 100% auto;
		box-shadow: var(--elevation--2);
		margin: 1rem auto;
		max-width: 112rem;
		position: relative;
		width: calc(100vw - 2rem);
	}

	/* If the background image fails to fill canvas,
	  this pseudo element ensures a white background */
	.main::before {
		background: white;
		bottom: 0;
		content: '';
		display: block;
		height: 100%;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		z-index: -1;
	}
</style>
