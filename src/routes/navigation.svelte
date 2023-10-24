<script lang="ts">
	import { readTokenInfo } from '$lib/store/api/read-token-info';
	import type { ClientState } from '$lib/store/initial-state';
	import { selectClient } from '$lib/store/selectors';
	import { logoutThunk } from '$lib/store/thunks/logout';
	import { storeCtx } from '$lib/context.js';

	const store = storeCtx.get();

	enum AuthenticatorState {
		Unauthenticated,
		Loading,
		Error,
		Authenticated
	}

	function deriveAuthenticatorState(
		client: ClientState['access'],
		mutationResult: { isError: boolean; isLoading: boolean }
	) {
		if (client === null) {
			if (mutationResult.isLoading === true) {
				return AuthenticatorState.Loading;
			} else if (mutationResult.isError === true) {
				return AuthenticatorState.Error;
			}
			return AuthenticatorState.Unauthenticated;
		}
		return AuthenticatorState.Authenticated;
	}

	let navDialog: HTMLDialogElement;
	$: navDialogIsOpen = false;

	let settingsDialog: HTMLDialogElement;

	let requestId: string;
	$: selector = readTokenInfo.select(requestId!);
	$: mutationResult = selector($store);
	$: authenticatorState = deriveAuthenticatorState($store.client.access, mutationResult);

	function onSubmitLogin(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(event.currentTarget);
		const result = store.dispatch(
			readTokenInfo.initiate({ access_token: formData.get('access_token') as string })
		);
		requestId = result.requestId;
	}

	function onResetLogin(
		event: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		store.dispatch(logoutThunk);
	}
</script>

<header>
	<nav class="nav">
		<button
			class="nav__open-nav"
			class:nav__open-nav--opened={navDialogIsOpen}
			type="button"
			on:click={function onClickToggleDialog() {
				navDialogIsOpen = !navDialogIsOpen;
				if (navDialogIsOpen) {
					navDialog?.show();
				} else {
					navDialog?.close();
				}
			}}
		>
			<img alt="closed" class:hide={navDialogIsOpen} src="/ri/menu-fold-line.svg" />
			<img alt="opened" class:hide={!navDialogIsOpen} src="/ri/menu-unfold-line.svg" />
		</button>
		<h1 class="nav__heading">
			<a href="/">Gwapo</a>
		</h1>
		<button
			class="nav__open-settings"
			on:click={function onClickOpenDialog() {
				if (!(settingsDialog?.open ?? false)) {
					settingsDialog?.showModal();
				}
			}}
		>
			<span class="hide">settings</span>
			<img alt="settings" src="/ri/settings-4-line.svg" />
		</button>
	</nav>
</header>
<dialog
	bind:this={navDialog}
	class="dialog--nav"
	on:close={function onCloseDialog() {
		navDialogIsOpen = false;
	}}
>
	<nav>
		<ul class="nav__list">
			<li class="nav__list__item">
				<a
					href="/"
					on:click={function closeDialog() {
						navDialog?.close();
					}}
				>
					home
				</a>
			</li>
			<li class="nav__list__item">
				<p>vault</p>
				<ul class="nav__list">
					<li class="nav__list__item">
						<a
							href="/vault/wallet"
							on:click={function closeDialog() {
								navDialog?.close();
							}}
						>
							wallet
						</a>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</dialog>
<dialog bind:this={settingsDialog}>
	<form method="dialog">
		<button formmethod="dialog" type="submit">close</button>
	</form>
	<hr />
	<form on:reset={onResetLogin} on:submit={onSubmitLogin}>
		{#if authenticatorState === AuthenticatorState.Authenticated}
			<button type="reset">logout</button>
		{:else}
			<input
				disabled={authenticatorState === AuthenticatorState.Loading}
				id="access_token"
				name="access_token"
				required
				type="text"
			/>
			<button disabled={authenticatorState === AuthenticatorState.Loading} type="submit">
				submit
			</button>
		{/if}
	</form>
</dialog>

<style>
	.dialog--nav {
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
		background-color: rgb(var(--primary--50));
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		position: relative;
		z-index: var(--elevation--6--height);
	}

	.nav__heading {
		margin: 0;
	}

	.nav__heading > a {
		color: rgb(var(--primary--900));
	}

	.nav__list {
		margin: 0;
	}

	.nav__list__item {
		/* display: inline-block; */
	}

	.nav__open-nav {
		align-self: stretch;
		background-color: transparent;
		border: 0;
		box-sizing: border-box;
		min-height: 2.75rem;
		outline-offset: -0.25rem;
		width: 2.75rem;
		padding: 0.25rem;
	}

	.nav__open-nav--opened {
		background-color: rgb(var(--primary--300));
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
