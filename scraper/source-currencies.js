require("dotenv").config({ path: `${process.cwd()}/scraper/.env` });
const fs = require("fs");

const { fetch, PouchDB } = require("./common");

const CURRENCIES_URL = "https://api.guildwars2.com/v2/currencies?ids=all";

async function main() {
  const pouchName = `gwapo_${process.env.START_TIME}_currencies`;
  const pouch = new PouchDB(pouchName, { adapter: "memory" });

  console.log("Fetching currencies...");
  const currencies = await fetch(CURRENCIES_URL).then((response) =>
    response.json()
  );
  console.log(`Found ${currencies.length} currencies.`);

  await pouch.bulkDocs(
    currencies.map((currency) => ({
      ...currency,
      _id: `currencies_${currency.id}`,
      $id: "gwapo/currencies",
    }))
  );

  console.log("Dumping currency database");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump-currencies.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
