import { createSelector } from "@reduxjs/toolkit";

import { api } from ".";
import { makeSelectIsInScope } from "../selectors";

import { Scope } from "../../types/token";

export interface ReadAccountBankArguments {}

export interface AccountBankItem {
  /** The item's ID. */
  id: number;
  /** The current binding of the item. Either Account or Character if present. */
  binding?: string;
  /** If binding is Character, this field tells which character it is bound to. */
  bound_to?: string;
  /** The amount of charges remaining on the item. */
  charges?: number;
  /** The amount of items in the item stack. */
  count: number;
  /** The IDs of the dyes applied to the item. Can be resolved against /v2/colors. */
  dyes?: number[];
  /** An array of item IDs for each infusion applied to the item. */
  infusions?: number[];
  /** The skin applied to the item, if it is different from its original. Can be resolved against /v2/skins. */
  skin?: number;
  /** The stats of the item. */
  stats?: {
    /** The ID of the item's stats. Can be resolved against /v2/itemstats. */
    id: number;
    /** The stats provided by this item. */
    attributes?: {
      /** Agony Resistance */
      AgonyResistance?: number;
      /** Concentration */
      BoonDuration?: number;
      /** Condition Damage */
      ConditionDamage?: number;
      /** Expertise */
      ConditionDuration?: number;
      /** Ferocity */
      CritDamage?: number;
      /** Healing Power */
      Healing?: number;
      /** Power */
      Power?: number;
      /** Precision */
      Precision?: number;
      /** Toughness */
      Toughness?: number;
      /** Vitality */
      Vitality?: number;
    };
  };
  /** The item IDs of the runes or sigills applied to the item. */
  upgrades?: number[];
  /** The slot occupied by the upgrade at the corresponding position in upgrades. */
  upgrade_slot_indices?: number[];
}

export type ReadAccountBankResult = (AccountBankItem | null)[];

const scopes = [Scope.Account, Scope.Inventories];
const scopeTags = [{ type: "access_token" as const, id: "LIST" }].concat(
  scopes.map((scope) => ({
    type: "access_token" as const,
    id: scope,
  }))
);

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountBank: build.query<ReadAccountBankResult, ReadAccountBankArguments>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        query() {
          return {
            url: "/v2/account/bank",
            validateStatus(response, body) {
              return response.status === 200 && Array.isArray(body) && body.length > 0;
            },
          };
        },
        providesTags() {
          return scopeTags;
        },
      }),
    };
  },
});

export const readAccountBank = injectedApi.endpoints.readAccountBank;
export const selectReadAccountBank = readAccountBank.select({});

export const selectReadAccountBankInScope = makeSelectIsInScope(scopes);

/** Gw2 constant: Each bank tab has 30 slots. Each account starts with 1 bank tab */
export const ITEMS_PER_TAB = 30;

export const selectAccountBankWithTabs = createSelector(selectReadAccountBank, (queryResult) => {
  const bankTabs = [];
  for (
    let bankTabIndex = 0;
    bankTabIndex < (queryResult.data?.length ?? 0);
    bankTabIndex += ITEMS_PER_TAB
  ) {
    bankTabs.push(queryResult.data!.slice(bankTabIndex, bankTabIndex + ITEMS_PER_TAB));
  }
  return bankTabs;
});
