const { sourcerer } = require("./sourcer");

async function main() {
  await sourcerer({
    gw2ApiUrl: "https://api.guildwars2.com/v2/titles",
    plural: "titles",
    singular: "title",
  });
}

main();
