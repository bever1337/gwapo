const { pouch } = require("./common");
// const util = require("util");

const BATCH_SIZE = 20;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const CONTINENTS_URL = "https://api.guildwars2.com/v2/continents";

async function main() {
  /** Fetch no faster than 1 second */
  const slowFetch = (requestInfo, requestInit) =>
    Promise.all([
      import("node-fetch")
        .then(({ default: fetch }) => fetch(requestInfo, requestInit))
        .then((response) => response.json()),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, BATCH_TASK_MINIMUM_LENGTH);
      }),
    ]).then(([response]) => response);

  console.log("Fetching continents indices...");
  /** @type {integer[]} */
  const continentsIds = await slowFetch(CONTINENTS_URL);
  console.log(`Found ${continentsIds.length} continents.`);
  console.log(`Batch size ${BATCH_SIZE}.`);
  console.log(
    `${Math.ceil(continentsIds.length / BATCH_SIZE)} fetches required.`
  );

  let continentsDocs = [];
  for (let i = 0; i < continentsIds.length; i += BATCH_SIZE * BATCH_STEP) {
    const continentsBatch = [];
    console.log(
      `Fetched ${i} continents so far. ${(
        (i / continentsIds.length) *
        100
      ).toFixed(2)}% complete`
    );
    for (
      let j = i;
      j < Math.min(i + BATCH_STEP * BATCH_SIZE, continentsIds.length);
      j += BATCH_SIZE
    ) {
      const continentsDataUrl = `${CONTINENTS_URL}?ids=${continentsIds
        .slice(j, j + BATCH_SIZE)
        .join(",")}`;
      continentsBatch.push(slowFetch(continentsDataUrl));
    }
    const batchedContinentsDocs = (await Promise.all(continentsBatch))[0].map(
      (continent) => ({
        ...continent,
        _id: `continents_${continent.id}`,
        $id: "continents",
      })
    );
    continentsDocs = continentsDocs.concat(batchedContinentsDocs);
  }
  await pouch.bulkDocs(continentsDocs);

  for (
    let continentIndex = 0;
    continentIndex < continentsDocs.length;
    continentIndex += 1
  ) {
    const continent = continentsDocs[continentIndex];
    let flattenedContinentFloors = [];
    console.log("Fetching floors for", continent.name);
    for (
      let batchIndex = 0;
      batchIndex < continent.floors.length;
      batchIndex += BATCH_SIZE * BATCH_STEP
    ) {
      const floorsBatch = [];
      for (
        let batchStartIndex = batchIndex;
        batchStartIndex <
        Math.min(batchIndex + BATCH_STEP * BATCH_SIZE, continent.floors.length);
        batchStartIndex += BATCH_SIZE
      ) {
        const floorsDataUrl = `${CONTINENTS_URL}/${
          continent.id
        }/floors?ids=${continent.floors
          .slice(batchStartIndex, batchStartIndex + BATCH_SIZE)
          .join(",")}`;
        floorsBatch.push(slowFetch(floorsDataUrl));
      } // end batch
      flattenedContinentFloors = (await Promise.all(floorsBatch)).reduce(
        (acc, floorDocs) =>
          floorDocs.reduce((accInner, floor) => accInner.concat(floor), acc),
        flattenedContinentFloors
      );
    } // end floors

    const floorsDocs = [];
    for (
      let floorIndex = 0;
      floorIndex < flattenedContinentFloors.length;
      floorIndex += 1
    ) {
      const floor = flattenedContinentFloors[floorIndex];
      floorsDocs.push({
        ...floor,
        continent_id: continent.id,
        _id: `continents/floors_${continent.id}_${floor.id}`,
        regions: Object.values(floor.regions || {}).map((region) => region.id),
      });
    }
    await pouch.bulkDocs(floorsDocs);

    const regionsDocs = [];
    for (
      let floorIndex = 0;
      floorIndex < flattenedContinentFloors.length;
      floorIndex += 1
    ) {
      const floor = flattenedContinentFloors[floorIndex];
      const floorRegions = Object.values(floor.regions);
      for (
        let regionIndex = 0;
        regionIndex < floorRegions.length;
        regionIndex += 1
      ) {
        const region = floorRegions[regionIndex];
        regionsDocs.push({
          ...region,
          continent_id: continent.id,
          floor_id: floor.id,
          _id: `continents/regions_${continent.id}_${floor.id}_${region.id}`,
          maps: Object.values(region.maps).map((map) => map.id),
        });
      }
    }
    await pouch.bulkDocs(regionsDocs);

    const mapsDocs = [];
    for (
      let floorIndex = 0;
      floorIndex < flattenedContinentFloors.length;
      floorIndex += 1
    ) {
      const floor = flattenedContinentFloors[floorIndex];
      const floorRegions = Object.values(floor.regions);
      for (
        let regionIndex = 0;
        regionIndex < floorRegions.length;
        regionIndex += 1
      ) {
        const region = floorRegions[regionIndex];
        const regionMaps = Object.values(region.maps);
        for (let mapIndex = 0; mapIndex < regionMaps.length; mapIndex += 1) {
          mapsDocs.push({
            ...regionMaps[mapIndex],
            continent_id: continent.id,
            floor_id: floor.id,
            _id: `continents/maps_${continent.id}_${floor.id}_${region.id}_${regionMaps[mapIndex].id}`,
            region_id: region.id,
          });
        }
      }
    }
    await pouch.bulkDocs(mapsDocs);
    // pouch
  } // end continent
}

main();
