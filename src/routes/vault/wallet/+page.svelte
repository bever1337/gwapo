<script context="module" lang="ts">
  import UFuzzy from "@leeoniya/ufuzzy";
  import type { Currency, ReadCurrenciesResult } from "$lib/store/api/read-currencies";

  const uFuzzy = new UFuzzy();
  const emptyArray: any[] = [];
  function filterCurrencies(needle: string, currencies: ReadCurrenciesResult): Currency["id"][] {
    const isNeedle = typeof needle === "string" && needle.length > 0;
    if (!isNeedle) {
      return currencies?.ids ?? emptyArray;
    }
    const haystack =
      currencies?.ids.map((currencyId) => currencies!.entities[currencyId].name) ?? emptyArray;
    const currencyIndices: number[] = uFuzzy.search(haystack, needle)[0] ?? emptyArray;
    const currencyIds =
      currencyIndices.map((currencyIndex) => currencies!.ids[currencyIndex]) ?? emptyArray;
    return currencyIds;
  }
</script>

<script lang="ts">
  import { browser } from "$app/environment";
  import { intl } from "$lib/intl";
  import { getAppDispatch } from "$lib/store";
  import { hydrate } from "$lib/store/actions";
  import { readAccountWallet } from "$lib/store/api/read-account-wallet";
  import { CurrencyCategory, readCurrencies } from "$lib/store/api/read-currencies";
  import { separateCopperCoins } from "$lib/types/currency";

  export let data;

  const dispatch = getAppDispatch();
  dispatch(hydrate(data));

  const readCurrencies$ = readCurrencies.query({});
  $: ({ data: currencies } = $readCurrencies$);

  const readAccountWallet$ = readAccountWallet.query({});
  $: ({ data: wallet, status: readWalletStatus } = $readAccountWallet$);

  $: supportedCurrencies =
    currencies?.ids.filter((currencyId) => {
      const entity = currencies?.entities[currencyId];
      const walletEntity = wallet?.entities[currencyId];
      if (!entity) return false;
      const inWallet = (walletEntity?.value ?? 0) > 0;
      if (inWallet) return true;
      return entity?.deprecated !== true;
    }) ?? [];

  let category: -1 | CurrencyCategory = -1;
  $: currenciesInCategory =
    category === -1
      ? supportedCurrencies
      : supportedCurrencies.filter((currencyId) => {
          const entity = currencies?.entities[currencyId];
          if (!entity) return false;
          return entity.categories.includes(category as CurrencyCategory);
        });

  let needle = "";
  $: filteredCurrencies = filterCurrencies(needle, {
    ids: currenciesInCategory,
    entities: currencies?.entities ?? {},
  });

  let selected: number[] = [];
  let expandAllSelected: boolean;
  $: expandAllSelected = selected.length === (currencies?.ids.length ?? 0);

  function onReset() {
    category = -1;
    needle = "";
    selected = [];
  }

  function onChangeExpandAllCurrencies(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    if (event.currentTarget?.checked) {
      selected = [...(currencies?.ids ?? [])];
    } else {
      selected = [];
    }
  }
</script>

<main class="main">
  <h1 class="banner__header">Wallet</h1>
  <form class="currencies" action="/vault/wallet" on:reset={onReset}>
    <nav class="currencies__nav">
      <label class="currencies__nav__select">
        <select
          bind:value={category}
          class="currencies__nav__select__input touch-area"
          name="selectCurrencies"
        >
          <option value={-1} label="All Currencies" />
          <option value={CurrencyCategory.General} label="General" />
          <option value={CurrencyCategory.Competitive} label="Competitive" />
          <option value={CurrencyCategory.Map} label="Map" />
          <option value={CurrencyCategory.Keys} label="Keys" />
          <option value={CurrencyCategory.Dungeon} label="Dungeon" />
          <option value={CurrencyCategory.BlackLion} label="Black Lion" />
        </select>
      </label>
      <label class="currencies__nav__filter">
        <img
          alt=""
          aria-hidden="true"
          class="currencies__nav__filter__icon"
          src="/ri/search-line.svg"
        />
        <span class="hide">Search currencies</span>
        <input
          bind:value={needle}
          class="currencies__nav__filter__input touch-area"
          name="filterCurrencies"
          placeholder="Search"
          type="search"
        />
      </label>
      <div class="currencies__nav__control">
        <button class="currencies__nav__reset touch-area" type="reset">
          <img alt="filter" class="currencies__nav__reset__img" src="/ri/filter-off-fill.svg" />
          <span>Reset</span>
        </button>
        <button
          class="currencies__nav__submit touch-area"
          class:hide--everywhere={browser}
          type="submit"
        >
          <span>Search</span>
        </button>
      </div>
      <input
        checked={expandAllSelected}
        class="hide"
        disabled={!browser}
        id="expandAllCurrencies"
        name="expandAllCurrencies"
        on:change={onChangeExpandAllCurrencies}
        type="checkbox"
      />
      <label class="currencies__nav__expand-all" for="expandAllCurrencies">
        <span class="hide">Expand all</span>
        <svg
          class="checkbox-icon checkbox-icon--closed"
          height="2.75rem"
          viewBox="0 0 24 24"
          width="2.75rem"
        >
          <use href="/ri/arrow-right-s-line.svg#path" />
        </svg>
        <svg
          class="checkbox-icon checkbox-icon--expanded"
          height="2.75rem"
          viewBox="0 0 24 24"
          width="2.75rem"
        >
          <use href="/ri/arrow-down-s-line.svg#path" />
        </svg>
      </label>
    </nav>
    <ol class="currencies__list">
      {#each filteredCurrencies as currencyId, index (currencyId)}
        {@const currency = currencies?.entities[currencyId]}
        {@const previousCurrencyId = filteredCurrencies[index - 1] ?? -1}
        {@const previousCurrency = currencies?.entities[previousCurrencyId]}
        {@const currencyIsCoin = (currency?.id ?? 0) === 1}
        {@const currencyWasGem = (previousCurrency?.id ?? 0) === 4}
        {@const showConversionDialog = currencyIsCoin && currencyWasGem}
        {#if showConversionDialog}
          <li class="currencies__list__item currencies__list__item--conversion">
            <div class="currency__picture currency__picture--conversion" />
            <a class="currency__name currency__name--conversion" href="/vault/wallet/exchange">
              View the Exchange
            </a>
            <div class="currency__control touch-area" />
            <a class="currency__wallet currency__wallet--conversion" href="/vault/wallet/exchange">
              Trade {previousCurrency?.name}s and {currency?.name}s!
            </a>
          </li>
        {/if}
        <li class="currencies__list__item currencies__list__item--currency">
          <div class="currency__picture">
            <img
              alt={currency?.name}
              class="currency__picture__img"
              height="64"
              src={currency?.icon}
              width="64"
            />
          </div>
          <label class="currency__name" for={`controlCurrency${currencyId}`}>
            {currency?.name}
          </label>
          <input
            bind:group={selected}
            class="hide"
            id={`controlCurrency${currencyId}`}
            name={`controlCurrency${currencyId}`}
            type="checkbox"
            value={currencyId}
          />
          <label class="currency__control" for={`controlCurrency${currencyId}`}>
            <svg
              class="checkbox-icon checkbox-icon--closed"
              height="2.75rem"
              viewBox="0 0 24 24"
              width="2.75rem"
            >
              <use href="/ri/arrow-right-s-line.svg#path" />
            </svg>
            <svg
              class="checkbox-icon checkbox-icon--expanded"
              height="2.75rem"
              viewBox="0 0 24 24"
              width="2.75rem"
            >
              <use href="/ri/arrow-down-s-line.svg#path" />
            </svg>
          </label>
          <p class="currency__wallet">
            {#if readWalletStatus === "fulfilled"}
              {#if currencyIsCoin}
                {@const [gold, silver, copper] = separateCopperCoins(
                  wallet?.entities[currencyId]?.value ?? 0
                )}
                {intl.formatNumber(gold)}
                <img
                  alt="gold"
                  height="64"
                  class="currency__wallet__coin-img"
                  src="/gw2/gold_coin.png"
                  width="64"
                />
                {`${silver}`}
                <img
                  alt="silver"
                  height="64"
                  class="currency__wallet__coin-img"
                  src="/gw2/silver_coin.png"
                  width="64"
                />
                {`${copper}`}
                <img
                  alt="copper"
                  height="64"
                  class="currency__wallet__coin-img"
                  src="/gw2/copper_coin.png"
                  width="64"
                />
              {:else}
                {intl.formatNumber(wallet?.entities[currencyId]?.value ?? 0)}
              {/if}
            {:else}
              {"\u00a0"}
            {/if}
          </p>
          <p class="currency__description">
            {currency?.description}
          </p>
        </li>
      {/each}
    </ol>
  </form>
</main>

<style>
  .banner__header {
    color: rgb(var(--primary--900));
    font-family: PTSerif, serif;
    margin: 0;
  }

  .checkbox-icon {
    fill: rgb(var(--primary--600));
    height: 2.75rem;
    width: 2.75rem;
  }

  input[type="checkbox"]:hover ~ label > .checkbox-icon {
    fill: rgb(var(--primary--800));
  }

  input[type="checkbox"]:active ~ label > .checkbox-icon {
    fill: rgb(var(--primary--900));
  }

  input[type="checkbox"]:active ~ label > .checkbox-icon,
  input[type="checkbox"]:focus ~ label > .checkbox-icon {
    outline: medium auto currentColor;
    outline: medium auto invert;
    outline: 5px auto -webkit-focus-ring-color;
  }

  *:checked ~ label > .checkbox-icon--closed,
  *:not(checked) ~ label > .checkbox-icon--expanded {
    display: none;
  }

  *:checked ~ label > .checkbox-icon--expanded,
  *:not(checked) ~ label > .checkbox-icon--closed {
    display: block;
  }

  .currencies {
    box-sizing: border-box;
    column-gap: var(--gutter);
    columns: 4 24rem;
    list-style: none;
  }

  .currencies__list {
    display: contents;
  }

  .currencies__list__item {
    align-items: center;
    border-radius: 0.25rem;
    box-shadow: var(--elevation--1);
    break-inside: avoid;
    display: grid;
    grid-template:
      "img header control" auto
      "img wallet wallet" auto
      "description description description" auto / auto 1fr auto;
    justify-items: flex-start;
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0.5rem;
  }

  .currencies__list__item--currency {
    background-color: rgb(var(--primary--50));
  }

  .currencies__list__item--conversion {
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.25),
        rgba(0, 0, 0, 0.2) 6rem,
        rgba(0, 0, 0, 0)
      ),
      url("/gw2/Currency_Exchange_banner.jpg");
    background-color: #061532;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0% 0%;
    border-radius: 0;
    /* magic bottom margin, do not remove */
    margin: -1rem 0.5rem -1px 0.5rem;
    padding: 1.5rem 0;
  }

  .currencies__nav {
    background-color: rgb(var(--primary--50));
    border-radius: 0.25rem;
    box-shadow: var(--elevation--1);
    break-inside: avoid;
    column-span: all;
    display: grid;
    gap: 1em;
    grid-template:
      "select toggle" auto
      "name null" auto
      "control null" auto / 1fr auto;
    justify-content: flex-start;
    padding: 0.5rem;
    margin: var(--gutter) 0 var(--margin) 0;
  }

  @media screen and (min-width: 42rem) {
    .currencies__nav {
      grid-template:
        "select name toggle" auto
        "control control null" auto / 16rem 16rem 1fr;
    }
  }

  @media screen and (min-width: 56rem) {
    .currencies__nav {
      grid-template: "select name control toggle" auto / 16rem 16rem auto 1fr;
    }
  }

  .currencies__nav__control {
    align-items: center;
    display: flex;
    grid-area: control;
    justify-content: space-between;
    max-width: 16rem;
  }

  .currencies__nav__expand-all {
    grid-area: toggle;
    margin-left: auto;
  }

  .currencies__nav__filter {
    align-items: center;
    background-color: rgb(var(--primary--100));
    border: 1px solid rgb(var(--primary--600));
    box-shadow: var(--elevation--1);
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    grid-area: name;
    max-width: 16rem;
    padding: 0 0 0 0.5rem;
    width: 100%;
  }

  .currencies__nav__filter:hover {
    border-color: rgb(var(--primary--800));
    cursor: text;
  }

  .currencies__nav__filter:active {
    border-color: rgb(var(--primary--900));
  }

  .currencies__nav__filter:focus-within {
    background-color: rgb(var(--white));
    border-color: rgb(var(--primary--900));
    outline: medium auto currentColor;
    outline: medium auto invert;
    outline: 5px auto -webkit-focus-ring-color;
  }

  .currencies__nav__filter__icon {
    height: 1.75rem;
    width: 1.75rem;
  }

  .currencies__nav__filter__input {
    background-color: transparent;
    border: 0 solid transparent;
    font-family: PTSans, sans;
    font-size: 1.125rem;
    padding: 0.25rem;
    width: 100%;
  }

  .currencies__nav__filter__input::placeholder {
    font-family: PTSerif, serif;
  }

  .currencies__nav__filter__input:focus {
    outline: none;
  }

  .currencies__nav__reset {
    background-color: rgb(var(--primary--100));
    border: 1px solid rgb(var(--primary--600));
    box-shadow: var(--elevation--1);
    box-sizing: border-box;
    font-family: PTSerif, serif;
    font-size: 1.125rem;
    justify-self: flex-start;
    padding: 0.25em 0.5em;
  }

  .currencies__nav__reset:hover {
    background-color: rgb(var(--primary--300));
    border-color: rgb(var(--primary--800));
  }

  .currencies__nav__reset:active {
    background-color: rgb(var(--primary--400));
    border-color: rgb(var(--primary--900));
  }

  .currencies__nav__reset__img {
    height: 1.75rem;
    width: 1.75rem;
    vertical-align: text-bottom;
  }

  .currencies__nav__select {
    display: contents;
  }

  .currencies__nav__select__input {
    background-color: rgb(var(--primary--100));
    border: 1px solid rgb(var(--primary--600));
    box-shadow: var(--elevation--1);
    box-sizing: border-box;
    font-family: PTSerif, serif;
    font-size: 1.125rem;
    grid-area: select;
    max-width: 16rem;
    padding: 0.125rem 1rem 0.125rem 0.5rem;
  }

  .currencies__nav__select__input:hover {
    background-color: rgb(var(--primary--300));
    border-color: rgb(var(--primary--800));
  }

  .currencies__nav__select__input:active {
    background-color: rgb(var(--primary--400));
    border-color: rgb(var(--primary--900));
  }

  .currencies__nav__submit {
    animation: 4s linear 0s 1 fadeIn;
    background-color: rgb(var(--primary--700));
    border: 1px solid rgb(var(--primary--800));
    box-shadow: var(--elevation--1);
    color: rgb(var(--primary--50));
    font-family: PTSerif, serif;
    font-size: 1.125rem;
    opacity: 1;
    padding: 0.25rem 1rem;
  }

  .currencies__nav__submit:hover {
    background-color: rgb(var(--primary--800));
    border-color: rgb(var(--primary--900));
  }

  .currencies__nav__submit:active {
    background-color: rgb(var(--primary--900));
    border-color: rgb(var(--black));
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    99% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media screen and (min-width: 56rem) {
    .currencies__nav__submit {
      margin: 0 1rem;
    }
  }

  .currency__control {
    align-self: start;
    grid-area: control;
  }

  .currency__description {
    border-top: 1px solid rgb(var(--primary--600));
    box-sizing: border-box;
    font-family: PTSans, sans-serif;
    grid-area: description;
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    margin: 0.5em 0 0 0;
    width: 100%;
  }

  input[type="checkbox"]:not(checked) ~ .currency__description {
    display: none;
  }

  input[type="checkbox"]:checked ~ .currency__description {
    display: block;
  }

  .currency__name {
    font-size: 1.125rem;
    font-family: PTSerif, serif;
    font-weight: normal;
    grid-area: header;
    overflow-wrap: anywhere;
    padding: 0.5rem 0.5rem 0.25rem 1rem;
    word-break: normal;
  }

  .currency__name--conversion {
    color: rgb(var(--primary--50));
    text-decoration: none;
    text-shadow: 2px 2px 4px rgb(var(--black));
  }

  .currency__name--conversion:active,
  .currency__name--conversion:focus,
  .currency__name--conversion:hover {
    text-decoration: underline;
  }

  .currency__picture {
    background: rgb(var(--primary--900));
    border: 0.25rem solid rgb(var(--primary--900));
    box-shadow: 0px 0px 1px rgb(var(--primary--800));
    box-sizing: content-box;
    display: inline-block;
    grid-area: img;
    height: 4rem;
    width: 4rem;
  }

  .currency__picture--conversion {
    background: unset;
    border-color: transparent;
    box-shadow: unset;
  }

  .currency__picture__img {
    color: rgb(var(--white));
    clip-path: border-box;
    filter: drop-shadow(0.125rem 0.125rem 0.5rem rgba(var(--primary--50) / 0.5));
    height: 4rem;
    width: 4rem;
  }

  .currency__wallet {
    align-self: center;
    font-family: PTSans, sans-serif;
    font-size: 1.25rem;
    grid-area: wallet;
    margin: 0 0.5rem 0.25rem 1rem;
  }

  .currency__wallet--conversion {
    color: rgb(var(--primary--50));
    font-family: PTSerif, serif;
    text-shadow: 1px 1px 3px rgb(var(--black));
  }

  .currency__wallet__coin-img {
    height: 1.5rem;
    margin: 0 1ch 0 0;
    vertical-align: text-bottom;
    width: 1.5rem;
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

  .hide--everywhere {
    display: none;
  }

  .main {
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.25) 4rem,
        rgba(255, 255, 255, 0.5) 8rem,
        rgba(255, 255, 255, 0.75) 32rem,
        rgba(255, 255, 255, 1)
      ),
      url("/gw2/pattern3.jpg");
    background-color: rgb(var(--white));
    background-position: 100% 0%;
    background-repeat: no-repeat;
    background-size: 60rem auto;
    box-shadow: var(--elevation--2);
    box-sizing: border-box;
    padding: 1rem var(--margin) var(--margin) var(--margin);
    margin: var(--margin) auto;
    max-width: calc(104rem + calc(2 * var(--margin)));
    width: 100%;
  }

  .touch-area {
    min-height: 2.75rem;
    min-width: 2.75rem;
  }
</style>
