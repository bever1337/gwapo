<script lang="ts">
	import { getSvelteStore, storeCtx } from '$lib/context';

	const store = getSvelteStore();
	storeCtx.set(store);
</script>

<header>
	<nav>
		<ul class="nav__list">
			<li class="nav__list__item">
				<a href="/">home</a>
			</li>
			<li class="nav__list__item">
				<a href="/vault/wallet">wallet</a>
			</li>
		</ul>
		<button>settings</button>
	</nav>
</header>

<slot />

<style>
	.nav__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav__list__item {
		display: inline-block;
	}
</style>
