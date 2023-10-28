<script lang="ts">
	import { intl } from '$lib/intl/index.js';
	import { separateCopperCoins } from '$lib/types/currency.js';

	export let copper: number;

	$: [goldOut, silverOut, copperOut] = separateCopperCoins(copper);
</script>

{#if goldOut > 0}
	{intl.formatNumber(goldOut)}
	<img class="img" alt="gold" src="/gw2/gold_coin.png" />
{/if}
{#if silverOut > 0 || goldOut > 0}
	{intl.formatNumber(silverOut)}
	<img class="img" alt="silver" src="/gw2/silver_coin.png" />
{/if}
{intl.formatNumber(copperOut)}
<img class="img" alt="copper" src="/gw2/copper_coin.png" />

<style>
	.img {
		height: 1.25em;
		margin: 0 1ch 0 0.25ch;
		vertical-align: text-bottom;
		width: 1.25em;
	}
</style>
