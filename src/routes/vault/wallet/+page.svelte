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
	$: ({ data: wallet, status: readWalletStatus } = $readAccountWalletStore);
</script>

<ol class="currencies__list">
	{#each currencies?.ids ?? [] as currencyId}
		{@const currency = currencies?.entities[currencyId]}
		<li class="currencies__list__item">
			<div class="currency__picture">
				<div class="currency__picture__border" />
				<img alt={currency?.name} class="currency__picture__img" src={currency?.icon} />
			</div>
			<label class="currency__name" for={`controlCurrency${currencyId}`}>
				{currency?.name}
			</label>
			<input class="currency__control" id={`controlCurrency${currencyId}`} type="checkbox" />
			<p class="currency__wallet">
				{#if readWalletStatus === 'fulfilled'}
					{wallet?.entities[currencyId]?.value ?? 0}
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

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
	<defs>
		<filter id="squiggle">
			<feTurbulence type="fractalNoise" id="turbulence" baseFrequency=".07" numOctaves="4" />
			<feDisplacementMap id="displacement" in="SourceGraphic" scale="4" />
		</filter>
	</defs>
</svg>

<style>
	.currencies__list {
		column-gap: 1rem;
		columns: 7 25rem;
		list-style: none;
		margin: 0;
		max-width: 182rem;
		padding: 0;
	}

	.currencies__list__item {
		align-items: center;
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

	.currency__control {
		align-self: start;
		grid-area: control;
		height: 2.75rem;
		width: 2.75rem;
	}

	.currency__description {
		border-top: 1px solid rgba(0, 0, 0, 0.4);
		display: none;
		grid-area: description;
		padding: 1rem 0.5rem 0.5rem 0.5rem;
		margin: 0.5em 0 0 0;
	}

	.currency__control:checked ~ .currency__description {
		display: block;
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
</style>
