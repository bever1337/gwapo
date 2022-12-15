const { pouch } = require("./common");

const CURRENCIES_URL = "https://api.guildwars2.com/v2/currencies?ids=all";

async function main() {
  console.log("Fetching currencies...");
  const currencies = await import("node-fetch").then(({ default: fetch }) =>
    fetch(CURRENCIES_URL).then((response) => response.json())
  );
  console.log(`Found ${currencies.length} currencies.`);

  await pouch.bulkDocs(
    currencies.map((currency) => ({
      ...currency,
      _id: `currencies_${currency.id}`,
      $id: "gwapo/currencies",
    }))
  );

  console.log("exit");
}

main();
