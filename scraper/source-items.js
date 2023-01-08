require("dotenv").config({ path: `${process.cwd()}/scraper/.env` });
const fs = require("fs");

const { fetch, PouchDB } = require("./common");

const BATCH_SIZE = 50;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const ITEMS_URL = "https://api.guildwars2.com/v2/items";

const gatekeptFetch = (requestInfo, requestInit) => {
  const fetchCtor = () =>
    fetch(requestInfo, requestInit).then((response) => response.json());
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
};

async function main() {
  const pouchName = `gwapo_${process.env.START_TIME}_items`;
  const pouch = new PouchDB(pouchName, { adapter: "memory" });
  console.log("Fetching item indices...");
  /** @type {integer[]} */
  const itemIds = await fetch(ITEMS_URL).then((response) => response.json());
  console.log(`Found ${itemIds.length} items.`);
  console.log(`Batch size ${BATCH_SIZE}.`);
  console.log(`${Math.ceil(itemIds.length / BATCH_SIZE)} fetches required.`);

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE * BATCH_STEP) {
    console.log(
      `Fetched ${i} items so far. ${((i / itemIds.length) * 100).toFixed(
        2
      )}% complete`
    );
    const batch = [];
    for (
      let j = i;
      j < Math.min(i + BATCH_STEP * BATCH_SIZE, itemIds.length);
      j += BATCH_SIZE
    ) {
      const itemsUrl = `${ITEMS_URL}?ids=${itemIds
        .slice(j, j + BATCH_SIZE)
        .join(",")}`;
      batch.push(
        gatekeptFetch(itemsUrl).then((itemsList) =>
          pouch.bulkDocs(
            itemsList.map((item) => ({
              ...item,
              _id: `items_${item.id}`,
              $id: "gwapo/items",
            }))
          )
        )
      );
    }
    await Promise.all(batch);
  }

  console.log("Dumping items database");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump-items.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
