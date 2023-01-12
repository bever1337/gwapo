require("dotenv").config({ path: `${process.cwd()}/scraper/.env` });
const fs = require("fs");

const { fetch, PouchDB } = require("./common");

const BATCH_SIZE = 200;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;

const achievementGroupsUrl =
  "https://api.guildwars2.com/v2/achievements/groups";
const achievementCategoriesUrl =
  "https://api.guildwars2.com/v2/achievements/categories";
const achievementUrl = "https://api.guildwars2.com/v2/achievements";

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
  const pouchName = `gwapo_${process.env.START_TIME}_achievements`;
  const pouch = new PouchDB(pouchName, { adapter: "memory" });

  console.log("Fetching achievement group ids");
  const achievementGroupUids = await fetch(achievementGroupsUrl).then(
    (response) => response.json()
  );

  console.log("Fetching achievement groups");
  const achievementGroups = await fetch(
    `${achievementGroupsUrl}?ids=${achievementGroupUids.join(",")}`
  ).then((response) => response.json());

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
              achievementCategory.achievements.forEach((achievementId) => {
                achievements[achievementId] = {
                  category: achievementCategory.id,
                  group: achievementGroup.id,
                  id: achievementId,
                  _id: `achievements_${achievementCategory.id}_${achievementId}`,
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

  console.log("Dumping achievements database");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump-achievements.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
