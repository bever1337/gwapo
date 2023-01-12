require("dotenv").config({ path: `${process.cwd()}/scraper/.env` });
const fs = require("fs");

const { fetch, PouchDB } = require("./common");

const BATCH_SIZE = 200;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const ITEMS_URL = "https://api.guildwars2.com/v2/materials";

async function main() {
  const pouchName = `gwapo_${process.env.START_TIME}_materials`;
  const pouch = new PouchDB(pouchName, { adapter: "memory" });

  /** Fetch no faster than 1 second */
  const gatekeptFetch = (requestInfo, requestInit) =>
    Promise.all([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, BATCH_TASK_MINIMUM_LENGTH);
      }),
      fetch(requestInfo, requestInit)
        .then((response) => response.json())
        .then((materialsJson) => {
          return pouch.bulkDocs(
            Object.values(materialsJson).map((materials) => ({
              ...materials,
              _id: `materials_${materials.id}`,
              $id: "gwapo/materials",
            }))
          );
        }),
    ]);

  console.log("Fetching materials indices...");
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
      console.log(itemsUrl);
      batch.push(gatekeptFetch(itemsUrl));
    }
    await Promise.all(batch);
  }

  console.log("Dumping materials database");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump-materials.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
