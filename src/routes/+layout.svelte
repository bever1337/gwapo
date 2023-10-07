<script lang="ts" type="module">
	import { getSvelteStore, storeCtx } from '$lib/context';

	const store = getSvelteStore();
	storeCtx.set(store);
</script>

<h1>Welcome to SvelteKit</h1>
<slot />
