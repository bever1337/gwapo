import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import type {
  AchievementCategoryDoc,
  AcheivementDoc,
} from "../../../types/achievement";
import type { DungeonDoc } from "../../../types/dungeon";

import { getPouch } from "../../../features/pouch";
import { api } from "../../../features/store/api";

const achievementAdapter = createEntityAdapter<DungeonAchievement>({
  /** Primarily sort by if achievement has dungeon, secondly by achievement id */
  sortComparer(dungeonAchievementA, dungeonAchievementB) {
    if (
      (dungeonAchievementA.dungeon_id?.length ?? 0) > 0 &&
      (dungeonAchievementB.dungeon_id?.length ?? 0) <= 0
    ) {
      return -1;
    } else if (
      (dungeonAchievementA.dungeon_id?.length ?? 0) <= 0 &&
      (dungeonAchievementB.dungeon_id?.length ?? 0) > 0
    ) {
      return 1;
    }
    return dungeonAchievementB.id - dungeonAchievementA.id;
  },
});

enum AchievementCategories {
  Dungeon = 27,
}

export type DungeonAchievement = Omit<AcheivementDoc, "tiers"> & {
  dungeon_id: DungeonDoc["id"] | undefined;
  dungeon_name: string | undefined;
  paths: DungeonDoc["paths"] | undefined;
  tiers:
    | (AcheivementDoc["tiers"][0] & { cumulative_count: number })[]
    | undefined;
};

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      // readAchievementsNodes: build.query<any, any>({
      //   queryFn(arg, api, extraOptions, baseQuery) {
      //     //
      //   },
      // }),
      readAchievements: build.query<
        EntityState<DungeonAchievement>,
        Record<string, never>
      >({
        queryFn() {
          const pouch = getPouch();
          return Promise.all([
            pouch.allDocs<DungeonDoc>({
              endkey: `dungeons_\ufff0`,
              include_docs: true,
              startkey: `dungeons_`,
            }),
            pouch
              .get<AchievementCategoryDoc>(
                `achievement_categories_${AchievementCategories.Dungeon}`
              )
              .then((dungeonAchievementCategoryResponse) =>
                pouch.allDocs<AcheivementDoc>({
                  include_docs: true,
                  keys: dungeonAchievementCategoryResponse.achievements.map(
                    (achievementId) => `achievements_${achievementId}`
                  ),
                })
              ),
          ]).then(([dungeonsResponse, dungeonAchievementsResponse]) => {
            const dungeons = dungeonsResponse.rows.reduce(
              (acc: Record<AcheivementDoc["id"], DungeonDoc>, { doc }) => {
                if (doc) {
                  acc[doc.achievementId] = doc;
                }
                return acc;
              },
              {}
            );
            const dungeonAchievements = dungeonAchievementsResponse.rows.reduce(
              function (acc: DungeonAchievement[], row) {
                if (!row.doc) {
                  return acc;
                }
                const dungeon = dungeons[row.doc.id];
                const dungeonName = dungeon?.id
                  .split("_")
                  .map((token) =>
                    (token[0] ?? "").toUpperCase().concat(token.substring(1))
                  )
                  .join(" ");
                let accumulateTier = 0;
                return acc.concat([
                  {
                    ...row.doc,
                    dungeon_id: dungeon?.id,
                    dungeon_name: dungeonName,
                    paths: dungeon?.paths,
                    tiers: row.doc.tiers?.map((tier) => {
                      const next = {
                        ...tier,
                        cumulative_count: tier.count + accumulateTier,
                      };
                      accumulateTier += tier.count;
                      return next;
                    }),
                  },
                ]);
              },
              []
            );
            const dungeonAchievementsEntityState = achievementAdapter.setAll(
              achievementAdapter.getInitialState(),
              dungeonAchievements
            );
            return { data: dungeonAchievementsEntityState };
          });
        },
      }),
    };
  },
});

export const readAchievements = injectedApi.endpoints.readAchievements;
