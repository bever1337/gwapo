import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { api } from ".";

import { Scope } from "../../../types/token";

interface ReadAccountAchievementsArguments {}

export interface AccountAchievement {
  /** This attribute contains an array of numbers, giving more
   * specific information on the progress for the achievement.
   * The meaning of each value varies with each achievement. Bits
   * start at zero. If an achievement is done, the in-progress
   * bits are not displayed. */
  bits?: any[];
  /** The player's current progress towards the achievement. */
  current?: number;
  /** Whether or not the achievement is done. */
  done: boolean;
  /** The achievement id. */
  id: number;
  /** The amount needed to complete the achievement. */
  max?: number;
  /** The number of times the achievement has been completed if the achievement is repeatable. */
  repeated?: number;
  /** Whether or not the achievement is unlocked. Note that if this property does not exist, the achievement is unlocked as well. */
  unlocked?: boolean;
}

type ReadAccountAchievementsResult = EntityState<AccountAchievement>;

const scopes = [Scope.Account, Scope.Progression];
const scopeTags = scopes
  .map((scope) => ({
    type: "access_token" as const,
    id: scope as any,
  }))
  .concat([{ type: "access_token" as const, id: "LIST" }]);

const accountAchievementsEntityAdapter =
  createEntityAdapter<AccountAchievement>();

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountAchievements: build.query<
        ReadAccountAchievementsResult,
        ReadAccountAchievementsArguments
      >({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags(result, error, queryArguments) {
          return scopeTags;
        },
        query() {
          return {
            url: "/v2/account/achievements",
            validateStatus(response, body) {
              return response.status === 200 && Array.isArray(body);
            },
          };
        },
        transformResponse(response: AccountAchievement[]) {
          return accountAchievementsEntityAdapter.setAll(
            accountAchievementsEntityAdapter.getInitialState(),
            response
          );
        },
      }),
    };
  },
});

export const readAccountAchievements =
  injectedApi.endpoints.readAccountAchievements;
