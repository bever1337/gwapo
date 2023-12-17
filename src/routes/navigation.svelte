<script lang="ts">
  import { skipToken } from "@reduxjs/toolkit/query";
  import { beforeNavigate } from "$app/navigation";
  import { getAppSelector } from "$lib/store";
  import { selectClient } from "$lib/store/api/selectors";
  import { readTokenInfo } from "$lib/store/api/read-token-info";

  const clientAccess$ = getAppSelector(selectClient);
  const readTokenInfo$ = readTokenInfo.query(skipToken, { skip: true });
  $: readTokenInfo$.next(
    $clientAccess$.access_token ? { access_token: $clientAccess$.access_token } : skipToken,
    { skip: !$clientAccess$.access_token }
  );

  let navDialog: HTMLDialogElement;
  let navDialogIsOpen = false;

  beforeNavigate(() => {
    navDialogIsOpen = false;
    navDialog?.close();
  });

  $: {
    if (navDialogIsOpen) {
      navDialog?.show();
    } else {
      navDialog?.close();
    }
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
      }}
    >
      <svg class="" height="2rem" viewBox="0 0 24 24" width="2rem">
        <use href="/ri/menu-line.svg#path" />
      </svg>
    </button>
    <h1 class="nav__heading">
      <a href="/">Gwapo</a>
    </h1>
    <a class="nav__open-settings" href="/session">
      <span class="hide">Manage your GWAPO session</span>
      <img
        alt="identicon"
        src={`/session/identicon?access_token=${$readTokenInfo$.currentData?.id ?? "praise joko"}`}
      />
    </a>
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
      <li>
        <a href="/">Home</a>
      </li>
      <ul class="nav__list">
        <li>
          <a href="/session">Session</a>
        </li>
        <li>
          <span>vault</span>
          <ul class="nav__list">
            <li>
              <a href="/vault/dyes">Dyes</a>
            </li>
            <li>
              <a href="/vault/wallet">Wallet</a>
              <ul>
                <li>
                  <a href="/vault/wallet/exchange">Currency Exchange</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </ul>
  </nav>
</dialog>

<style>
  .dialog--nav {
    background-color: rgb(var(--primary--200));
    border: 0px solid transparent;
    box-shadow: inset 0 0.5rem 0.5rem -0.25rem rgb(var(--black) / 0.3), var(--elevation--5);
    box-sizing: border-box;
    min-height: calc(100vh - 3.25rem);
    margin: 0;
    max-width: 45rem;
    padding: 1rem;
    position: absolute;
    top: 3.25rem;
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
    padding: 0 var(--margin) 0 var(--margin);
  }

  .nav__heading {
    margin: 0;
  }

  .nav__heading > a {
    color: rgb(var(--primary--900));
    font-family: PTSerif, serif;
    text-decoration: none;
  }

  .nav__heading > a:active,
  .nav__heading > a:focus,
  .nav__heading > a:hover {
    text-decoration: underline;
  }

  .nav__list {
    margin: 0;
  }

  .nav__open-nav {
    align-self: stretch;
    background-color: transparent;
    border: 0;
    box-sizing: border-box;
    outline-offset: -0.25rem;
    padding: 0.25rem;
    margin: 0 2ch 0 0;
    min-width: 2.75rem;
  }

  .nav__open-nav--opened {
    background-color: rgb(var(--primary--300));
  }

  .nav__open-settings {
    box-sizing: border-box;
    height: 2.75rem;
    padding: 0.25rem;
    margin: 0.25rem 0 0.25rem auto;
    min-width: 2.75rem;
  }

  .nav__open-nav > svg,
  .nav__open-settings > img {
    height: 2rem;
    vertical-align: text-bottom;
    width: 2rem;
  }

  .nav__open-nav > svg {
    fill: rgb(var(--primary--800));
  }

  .nav__open-nav:focus > svg,
  .nav__open-nav:hover > svg {
    fill: rgb(var(--primary--900));
  }

  .nav__open-nav:focus-within,
  .nav__open-nav:active {
    fill: rgb(var(--black));
    outline: medium auto currentColor;
    outline: medium auto invert;
    outline: 5px auto -webkit-focus-ring-color;
  }
</style>
