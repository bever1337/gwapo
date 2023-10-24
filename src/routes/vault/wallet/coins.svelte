<script lang="ts">
	import { intl } from '$lib/intl/index.js';
	import { separateCopperCoins } from '$lib/types/currency.js';

	export let copper: number;

	$: [goldOut, silverOut, copperOut] = separateCopperCoins(copper);
</script>

{intl.formatNumber(goldOut)}
<img class="img" alt="gold" src="/gw2/gold_coin.png" />
{intl.formatNumber(silverOut)}
<img class="img" alt="silver" src="/gw2/silver_coin.png" />
{intl.formatNumber(copperOut)}
<img class="img" alt="copper" src="/gw2/copper_coin.png" />

<style>
	.img {
		height: 1.25em;
		width: 1.25em;
	}
</style>
