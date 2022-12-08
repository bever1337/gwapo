const { pouch } = require("./common");

const BATCH_SIZE = 50;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const SKINS_URL = "https://api.guildwars2.com/v2/skins";

const gatekeptFetch = (requestInfo, requestInit) => {
  const fetchCtor = () =>
    import("node-fetch")
      .then(({ default: fetch }) => fetch(requestInfo, requestInit))
      .then((response) => response.json());
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
  const fetch = await import("node-fetch").then(({ default: fetch }) => fetch);
  /** Fetch no faster than 1 second */

  console.log("Fetching skin indices...");
  /** @type {integer[]} */
  const skinIds = await fetch(SKINS_URL).then((response) => response.json());
  console.log(`Found ${skinIds.length} skins.`);
  console.log(`Batch size ${BATCH_SIZE}.`);
  console.log(`${Math.ceil(skinIds.length / BATCH_SIZE)} fetches required.`);

  for (let i = 0; i < skinIds.length; i += BATCH_SIZE * BATCH_STEP) {
    console.log(
      `Fetched ${i} skins so far. ${((i / skinIds.length) * 100).toFixed(
        2
      )}% complete`
    );
    const batch = [];
    for (
      let j = i;
      j < Math.min(i + BATCH_STEP * BATCH_SIZE, skinIds.length);
      j += BATCH_SIZE
    ) {
      const skinsBatchUrl = `${SKINS_URL}?ids=${skinIds
        .slice(j, j + BATCH_SIZE)
        .join(",")}`;
      batch.push(
        gatekeptFetch(skinsBatchUrl).then((skinsList) =>
          pouch.bulkDocs(
            skinsList.map((skin) => ({
              ...skin,
              _id: `skins_${skin.id}`,
              $id: "gwapo/skins",
            }))
          )
        )
      );
    }
    await Promise.all(batch);
  }

  console.log("exit");
}

main();
