<script lang="ts">
	import { getSvelteStore, storeCtx } from '$lib/context';
	import Footer from './footer.svelte';
	import Navigation from './navigation.svelte';

	const store = getSvelteStore();
	storeCtx.set(store);
</script>

<div class="layout">
	<Navigation />
	<slot />
	<Footer />
</div>

<style>
	:global(:root) {
		--white: 255 255 255;
		--black: 0 0 0;
		--primary--50: 250 250 246;
		--primary--100: 244 244 240;
		--primary--200: 236 236 232;
		--primary--300: 221 221 217;
		--primary--400: 186 186 182;
		--primary--500: 154 154 151;
		--primary--600: 114 114 110;
		--primary--700: 94 94 91;
		--primary--800: 63 63 60;
		--primary--900: 30 30 28;
		--elevation--1: 0px 1px 3px rgb(var(--black) / 0.3);
		--elevation--2: 1px 1px 4px rgb(var(--black) / 0.3);
		--elevation--3: 2px 1px 4px rgb(var(--black) / 0.4);
		--elevation--4: 3px 2px 4px rgb(var(--black) / 0.4);
		--elevation--4--height: 40;
		--elevation--5: 4px 3px 0.5rem rgb(var(--black) / 0.4);
		--elevation--5--height: 50;
		--elevation--6: 5px 4px 0.5rem rgb(var(--black) / 0.4);
		--elevation--6--height: 60;
	}

	:global(body) {
		background-color: rgb(var(--primary--800));
		margin: 0;
		overflow-y: scroll;
	}

	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
