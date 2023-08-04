const { sourcerer } = require("./sourcer");

const dungeonsToAchievements = {
  ascalonian_catacombs: 186,
  caudecus_manor: 185,
  twilight_arbor: 189,
  sorrows_embrace: 188,
  citadel_of_flame: 191,
  honor_of_the_waves: 190,
  crucible_of_eternity: 192,
  ruined_city_of_arah: 187,
};

async function main() {
  await sourcerer({
    gw2ApiUrl: "https://api.guildwars2.com/v2/dungeons",
    handleDoc(gw2Entity, couchEntity) {
      return {
        ...(couchEntity ?? {}),
        ...gw2Entity,
        achievementId: dungeonsToAchievements[gw2Entity.id],
        _id: `dungeons_${gw2Entity.id}`,
        $id: "gwapo/dungeons",
      };
    },
    plural: "dungeons",
    singular: "dungeon",
  });
}

main();
