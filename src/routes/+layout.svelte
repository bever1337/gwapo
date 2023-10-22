<script lang="ts">
	import { getSvelteStore, storeCtx } from '$lib/context';

	const store = getSvelteStore();
	storeCtx.set(store);

	let dialog: HTMLDialogElement;
	$: open = false;

	function closeDialog() {
		dialog?.close();
	}
</script>

<header>
	<nav class="nav">
		<button
			class="nav__open-nav"
			class:nav__open-nav--opened={open}
			type="button"
			on:click={function onClickToggleDialog() {
				open = !open;
				if (open) {
					dialog?.show();
				} else {
					dialog?.close();
				}
			}}
		>
			<img alt="closed" class:hide={open} src="/ri/menu-fold-line.svg" />
			<img alt="opened" class:hide={!open} src="/ri/menu-unfold-line.svg" />
		</button>
		<h1 class="nav__heading"><a href="/">Gwapo</a></h1>
		<button class="nav__open-settings">
			<span class="hide">settings</span>
			<img alt="settings" src="/ri/settings-4-line.svg" />
		</button>
	</nav>
</header>

<dialog
	bind:this={dialog}
	class="dialog"
	on:close={function onCloseDialog() {
		open = false;
	}}
>
	<nav>
		<ul class="nav__list">
			<li class="nav__list__item">
				<a href="/" on:click={closeDialog}>home</a>
			</li>
			<li class="nav__list__item">
				<p>vault</p>
				<ul class="nav__list">
					<li class="nav__list__item">
						<a href="/vault/wallet" on:click={closeDialog}>wallet</a>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</dialog>

<slot />

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
		--elevation--1: 1px 1px 2px rgb(var(--black) / 0.2);
		--elevation--2: 2px 1px 4px rgb(var(--black) / 0.2);
		--elevation--3: 3px 2px 6px rgb(var(--black) / 0.3);
		--elevation--4: 3px 2px 6px rgb(var(--black) / 0.3);
		--elevation--4--height: 40;
		--elevation--5: 4px 6px 0.5rem rgb(var(--black) / 0.4);
		--elevation--5--height: 50;
		--elevation--6: 4px 6px 0.5rem rgb(var(--black) / 0.4);
		--elevation--6--height: 60;
	}

	:global(body) {
		background-color: rgb(var(--primary--50));
		margin: 0;
		overflow-y: scroll;
	}

	.dialog {
		background-color: rgb(var(--primary--200));
		border: 0px solid transparent;
		box-shadow: inset 0 6px 4px -4px rgb(var(--black) / 0.4), var(--elevation--5);
		box-sizing: border-box;
		min-height: calc(100vh - 3.25rem);
		margin: 0;
		max-width: 45rem;
		padding: 1rem;
		position: absolute;
		top: 3.25rem;
		transition: all 3s linear;
		width: 100%;
		z-index: var(--elevation--5--height);
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

	.nav {
		align-items: center;
		box-shadow: var(--elevation--6);
		background-color: rgb(var(--primary--900));
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin: 0 0 1rem 0;
		position: relative;
		z-index: var(--elevation--6--height);
	}

	.nav__heading {
		margin: 0;
	}

	.nav__heading > a {
		color: rgb(var(--primary--100));
	}

	.nav__list {
		margin: 0;
	}

	.nav__list__item {
		/* display: inline-block; */
	}

	.nav__open-nav {
		align-self: stretch;
		background-color: rgb(var(--primary--900));
		border: 0;
		box-sizing: border-box;
		min-height: 2.75rem;
		outline-offset: -0.25rem;
		width: 2.75rem;
		padding: 0.25rem;
	}

	.nav__open-nav--opened {
		background-color: rgb(var(--primary--800));
	}

	.nav__open-settings {
		box-sizing: border-box;
		margin: 0.25rem 0.5rem;
		padding: 0.25rem;
		height: 2.75rem;
		width: 2.75rem;
	}

	.nav__open-nav > img,
	.nav__open-settings > img {
		height: 2rem;
		width: 2rem;
	}
</style>
