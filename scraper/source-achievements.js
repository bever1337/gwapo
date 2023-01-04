const { pouch } = require("./common");

const BATCH_SIZE = 50;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;

const achievementGroupsUrl =
  "https://api.guildwars2.com/v2/achievements/groups";
const achievementCategoriesUrl =
  "https://api.guildwars2.com/v2/achievements/categories";
const achievementUrl = "https://api.guildwars2.com/v2/achievements";

const fetch = (() => {
  const fetchPromise = import("node-fetch").then(({ default: fetch }) => fetch);
  return function (requestInfo, requestInit) {
    return fetchPromise.then((resolvedFetch) =>
      resolvedFetch(requestInfo, requestInit)
    );
  };
})();

function slowFetch(requestInfo, requestInit) {
  const fetchCtor = () =>
    fetch(requestInfo, requestInit).then((response) => {
      if (response.status !== 200) {
        return Promise.reject("bad query");
      }
      return response.json();
    });
  return Promise.all([
    fetchCtor().catch((error) => {
      console.error(error);
      console.warn("RETRYING", requestInfo);
      return fetchCtor();
    }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, BATCH_TASK_MINIMUM_LENGTH);
    }),
  ]).then(([response]) => response);
}

async function main() {
  const achievementGroupUids = await slowFetch(achievementGroupsUrl);
  const achievementGroups = await slowFetch(
    `${achievementGroupsUrl}?ids=${achievementGroupUids.join(",")}`
  );
  const achievements = {};

  for (
    let iterateAchievementGroups = 0;
    iterateAchievementGroups < achievementGroups.length;
    iterateAchievementGroups++
  ) {
    const batch = [];
    const achievementGroup = achievementGroups[iterateAchievementGroups];
    for (
      let iterateAchievementCategories = 0;
      iterateAchievementCategories < achievementGroup.categories.length;
      iterateAchievementCategories += BATCH_SIZE
    ) {
      const achievementCategoryIdsUrl = `${achievementCategoriesUrl}?ids=${achievementGroup.categories
        .slice(
          iterateAchievementCategories,
          iterateAchievementCategories + BATCH_SIZE
        )
        .join(",")}`;

      batch.push(
        slowFetch(achievementCategoryIdsUrl).then(
          (batchedAchievementCategories) => {
            batchedAchievementCategories.forEach((achievementCategory) => {
              console.debug(achievementCategory.name, achievementCategory.id);
              achievementCategory.achievements.forEach((achievementId) => {
                achievements[achievementId] = {
                  category: achievementCategory.id,
                  group: achievementGroup.id,
                  id: achievementId,
                  _id: `achievements_${achievementId}`,
                  $id: "gwapo/achievements",
                };
              });
            });
          }
        )
      );
    }
    await Promise.all(batch);
  }

  const achievementIds = Object.keys(achievements);
  for (let i = 0; i < achievementIds.length; i += BATCH_SIZE * BATCH_STEP) {
    console.log(
      `Fetched ${i} achievements so far. ${(
        (i / achievementIds.length) *
        100
      ).toFixed(2)}% complete`
    );
    const batch = [];
    for (
      let j = i;
      j < Math.min(i + BATCH_STEP * BATCH_SIZE, achievementIds.length);
      j += BATCH_SIZE
    ) {
      const achievementIdsUrl = `${achievementUrl}?ids=${achievementIds
        .slice(j, j + BATCH_SIZE)
        .join(",")}`;

      batch.push(
        slowFetch(achievementIdsUrl).then((achievementsList) =>
          pouch.bulkDocs(
            achievementsList.map((achievement) => ({
              ...achievement,
              ...achievements[achievement.id],
            }))
          )
        )
      );
    }
    await Promise.all(batch);
  }
}

main();
