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

<ol class="currency__list">
	{#each currencies?.ids ?? [] as currencyId}
		{@const currency = currencies?.entities[currencyId]}
		<li class="currency__list__item">
			<div class="currency__picture" style="grid-area: img;">
				<div class="squiggle--child" />
				<img alt={currency?.name} class="currency__img" src={currency?.icon} />
			</div>
			<h3 class="currency__header" style="grid-area: header;">
				{currency?.name}
			</h3>
			<input class="currency__control" style="grid-area: control;" type="checkbox" />
			<p class="currency__wallet" style="grid-area: wallet;">
				{#if readWalletStatus === 'fulfilled'}
					{wallet?.entities[currencyId]?.value ?? 0}
				{:else if readWalletStatus === 'rejected'}
					{'?'}
				{:else}
					{'\u00a0'}
				{/if}
			</p>
			<p class="currency__description" style="grid-area: description;">
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
	.currency__list {
		column-gap: 1rem;
		columns: 7 26rem;
		list-style: none;
		margin: 0;
		max-width: 188rem;
		padding: 0;
	}

	.currency__list__item {
		align-items: center;
		/* border: 1px solid rgba(0, 0, 0, 0.5); */
		box-shadow: 3px 2px 6px rgba(0, 0, 0, 0.6);
		break-inside: avoid;
		display: grid;
		/* gap: 1rem; */
		grid-template:
			'img header control' auto
			'img wallet wallet' auto
			'description description description' auto / auto 1fr auto;
		margin: 0 0 1rem 0;
		padding: 0.5rem;
	}

	.currency__description {
		border-top: 1px solid rgba(0, 0, 0, 0.4);
		display: none;
		padding: 1rem 0.5rem 0.5rem 0.5rem;
		margin: 0.5em 0 0 0;
	}

	.currency__control {
		align-self: start;
		height: 2.75rem;
		width: 2.75rem;
	}

	.currency__control:checked ~ .currency__description {
		display: block;
	}

	.currency__header {
		font-weight: normal;
		margin: 0.5rem 0.5rem 0.25rem 1rem;
	}

	.currency__picture {
		display: inline-block;
		height: calc(4rem + 4px);
		position: relative;
		width: calc(4rem + 4px);
	}

	.currency__wallet {
		align-self: center;
		font-size: 1.5rem;
		margin: 0 0.5rem 0.25rem 1rem;
	}

	.currency__img {
		filter: drop-shadow(4px 3px 10px rgba(255, 255, 255, 0.5));
		height: 4rem;
		left: 3px;
		position: absolute;
		top: 3px;
		width: 4rem;
	}

	.squiggle--child {
		border: 3px solid rgba(0, 0, 0, 0.9);
		background: rgba(0, 0, 0, 0.9);
		display: inline-block;
		filter: url(#squiggle);
		height: 4rem;
		position: absolute;
		width: 4rem;
	}
</style>
