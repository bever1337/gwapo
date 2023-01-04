import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";
import { getDatabaseName } from "./read-gwapo-databases";

import { PouchDB } from "../../pouch";

export interface Achievement {
  /** The achievement id. */
  id: number;
  /** The achievement icon. */
  icon?: string;
  /** The achievement name. */
  name: string;
  /** The achievement description. */
  description: string;
  /** The achievement requirement as listed in-game. */
  requirement: string;
  /** The achievement description prior to unlocking it. */
  locked_text: string;
  /**
   * The achievement type.
   * Default - A default achievement.
   * ItemSet - Achievement is linked to Collections
   */
  type: "Default" | "ItemSet";
  /** Achievement categories. */
  flags: (
    | "Pvp"
    | "CategoryDisplay"
    | "MoveToTop"
    | "IgnoreNearlyComplete"
    | "Repeatable"
    | "Hidden"
    | "RequiresUnlock"
    | "RepairOnLogin"
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Permanent"
  )[];
  /** Describes the achievement's tiers. */
  tiers: {
    /** The number of "things" (achievement-specific) that must be completed to achieve this tier. */
    count: number;
    /** The amount of AP awarded for completing this tier. */
    points: number;
  }[];
  /** Contains an array of achievement ids required to progress the given achievement. */
  prerequisites?: number[];
  /** Describes the rewards given for the achievement. */
  rewards?: (
    | {
        type: "Coins";
        /** The number of Coins to be rewarded. */
        count: number;
      }
    | {
        type: "Item";
        /** The item ID to be rewarded. */
        id: number;
        /** The number of id to be rewarded. */
        count: number;
      }
    | {
        type: "Mastery";
        /** The mastery point ID to be rewarded. */
        id: number;
        /** The region the Mastery Point applies to. Either Tyria, Maguuma, Desert or Tundra. */
        region: string;
      }
    | {
        type: "Title";
        /** The title id. */
        id: number;
      }
  )[];
  bits?: (
    | {
        /** The type of bit. Can be Text, Item, Minipet, or Skin. */
        type: "Text";
        /** The text for the bit, if type is Text. */
        text: string;
      }
    | {
        /** The type of bit. Can be Text, Item, Minipet, or Skin. */
        type: "Item" | "Minipet" | "Skin";
        /** The ID of the item, mini, or skin, if applicable. */
        id?: number;
      }
  )[];
  /** The maximum number of AP that can be rewarded by an achievement flagged as Repeatable. */
  point_cap?: number;
}

export const achievementAdapter = createEntityAdapter<Achievement>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAchievements: build.query<EntityState<Achievement>, { key: any }>({
        providesTags() {
          return [{ type: "internal/pouches", id: "BEST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then((databaseName) =>
              new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                "gw2_achievements/detailed_type",
                {
                  key: queryArguments.key,
                  include_docs: true,
                  startkey: "achievements_0",
                  endkey: "achievements_\ufff0",
                }
              )
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse.rows.reduce(
                  (acc, row) =>
                    achievementAdapter.setOne(
                      acc,
                      row.doc as any as Achievement
                    ),
                  achievementAdapter.getInitialState()
                ),
                error: undefined,
              };
            })
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const readAchievements = injectedApi.endpoints.readAchievements;
