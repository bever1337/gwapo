<script lang="ts">
	import { storeCtx } from '$lib/context';
	import { useQuery } from '$lib/rtk-svelte/hooks.js';
	import { hydrate } from '$lib/store/actions.js';
	import { readCurrencies } from '$lib/store/api/read-currencies';

	export let data;

	const store = storeCtx.get();
	store.dispatch(hydrate(data));

	const selectedQ = useQuery(readCurrencies)(store)({});
</script>

<a href="/">home</a>
{$selectedQ.status}
{#each $selectedQ.data?.ids ?? [] as currencyId}
	<li>{currencyId}</li>
{/each}
