const { sourcerer } = require("./sourcer");

async function main() {
  const achievementGroups = await sourcerer({
    gw2ApiUrl: "https://api.guildwars2.com/v2/achievements/groups",
    plural: "achievement_groups",
    singular: "achievement_group",
  });
  const achievementCategories = await sourcerer({
    gw2ApiUrl: "https://api.guildwars2.com/v2/achievements/categories",
    plural: "achievement_categories",
    singular: "achievement_category",
  });
  const reverseGroups = achievementGroups.ids.reduce(
    (acc, achievementGroupId) => {
      const achievementGroup = achievementGroups.entities[achievementGroupId];
      return achievementGroup.categories.reduce(
        (acc2, achievementCategoryId) => {
          if (acc2[achievementCategoryId]) {
            throw new Error("Category exists in multiple groups");
          }
          return {
            ...acc2,
            [achievementCategoryId]: achievementGroup.id,
          };
        },
        acc
      );
    },
    {}
  );
  const reverseCategories = achievementCategories.ids.reduce(
    (acc, achievementCategoryId) => {
      const achievementCategory =
        achievementCategories.entities[achievementCategoryId];
      return achievementCategory.achievements.reduce((acc2, achievementId) => {
        if (acc2[achievementId]) {
          throw new Error("Achievement exists in multiple categories");
        }
        return {
          ...acc2,
          [achievementId]: achievementCategory.id,
        };
      }, acc);
    },
    {}
  );

  await sourcerer({
    gw2ApiUrl: "https://api.guildwars2.com/v2/achievements",
    handleDoc(gw2Entity, couchEntity) {
      const docId = `achievements_${gw2Entity.id}`;
      const achievementCategory = reverseCategories[gw2Entity.id];
      const achievementGroup = reverseGroups[achievementCategory];
      return {
        ...(couchEntity ?? {}),
        ...gw2Entity,
        _id: docId,
        $id: `gwapo/achievements`,
        category: achievementCategory,
        group: achievementGroup,
      };
    },
    plural: "achievements",
    singular: "achievement",
  });
}

main();
