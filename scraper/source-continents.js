const { pouch } = require("./common");
// const util = require("util");

const BATCH_SIZE = 20;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const CONTINENTS_URL = "https://api.guildwars2.com/v2/continents";

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

async function main() {
  console.log("Fetching maps indices...");
  const mapsIds = await slowFetch("https://api.guildwars2.com/v2/maps");
  const gw2Maps = {};
  for (
    let batchIndex = 0;
    batchIndex < mapsIds.length;
    batchIndex += BATCH_SIZE * BATCH_STEP
  ) {
    const mapsBatch = [];
    for (
      let batchStartIndex = batchIndex;
      batchStartIndex <
      Math.min(batchIndex + BATCH_STEP * BATCH_SIZE, mapsIds.length);
      batchStartIndex += BATCH_SIZE
    ) {
      const idsThisBatch = mapsIds
        .slice(batchStartIndex, batchStartIndex + BATCH_SIZE)
        .join(",");
      console.log(
        `Fetched ${batchStartIndex} maps so far, ${(
          (batchStartIndex / mapsIds.length) *
          100
        ).toFixed(2)}%. Ids this batch: ${idsThisBatch}`
      );
      const floorsDataUrl = `https://api.guildwars2.com/v2/maps?ids=${idsThisBatch}`;
      mapsBatch.push(slowFetch(floorsDataUrl));
    }
    for (const mapsInBatch of await Promise.all(mapsBatch)) {
      for (const map in mapsInBatch) {
        gw2Maps[map.id] = {
          $id: "gwapo/maps/maps",
          _id: `maps_${map.id}`,
          continent_id: map.continent_id,
          continent_rect: map.continent_rect,
          default_floor: map.default_floor,
          floors: map.floors,
          id: map.id,
          map_rect: map.map_rect,
          max_level: map.max_level,
          min_level: map.min_level,
          name: map.name,
          region_id: map.region_id,
        };
      }
    }
  }

  console.log("Fetching continents indices...");
  const continentsIds = await slowFetch(CONTINENTS_URL);
  console.log(`Fetching continents: ${continentsIds.join(",")}`);
  const continentsDataUrl = `${CONTINENTS_URL}?ids=${continentsIds.join(",")}`;
  const gw2Continents = await slowFetch(continentsDataUrl);
  console.log("Putting continents in pouch");
  await pouch.bulkDocs(
    gw2Continents.map((continent) => ({
      _id: `continents_${continent.id}`,
      $id: "gwapo/maps/continents",
      continent_dims: continent.continent_dims,
      id: continent.id,
      min_zoom: continent.min_zoom,
      max_zoom: continent.max_zoom,
      name: continent.name,
    }))
  );

  for (const continent of gw2Continents) {
    let gw2Floors = [];
    console.log(`Fetching floors for ${continent.name} in batches...`);
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
        const idsThisBatch = continent.floors
          .slice(batchStartIndex, batchStartIndex + BATCH_SIZE)
          .join(",");
        console.log(
          `Fetched ${batchStartIndex} ${continent.name} floors so far, ${(
            (batchStartIndex / continent.floors.length) *
            100
          ).toFixed(2)}%. Ids this batch: ${idsThisBatch}`
        );
        const floorsDataUrl = `${CONTINENTS_URL}/${continent.id}/floors?ids=${idsThisBatch}`;
        floorsBatch.push(slowFetch(floorsDataUrl));
      }
      for (const floorsInBatch of await Promise.all(floorsBatch)) {
        gw2Floors = gw2Floors.concat(floorsInBatch);
      }
    }
    console.log(`Putting ${continent.name} floors in pouch`);
    await pouch.bulkDocs(
      gw2Floors.map((floor) => ({
        $id: "gwapo/maps/floors",
        _id: `floors_${continent.id}_${floor.id}`,
        clamped_view: floor.clamped_view,
        continent_id: continent.id,
        id: floor.id,
        texture_dims: floor.texture_dims,
      }))
    );

    console.log(`Reducing ${continent.name} floors into regions`);
    const regionsDocs = {};
    for (const floor of gw2Floors) {
      for (const region of Object.values(floor.regions)) {
        regionsDocs[region.id] = {
          $id: "gwapo/maps/regions",
          _id: `regions_${continent.id}_${region.id}`,
          continent_id: continent.id,
          continent_rect: region.continent_rect,
          floors: (regionsDocs[region.id]?.floors ?? []).concat([floor.id]),
          id: region.id,
          label_coord: region.label_coord,
          name: region.name,
        };
      }
    }
    console.log(`Putting ${continent.name} regions in pouch`);
    await pouch.bulkDocs(Object.values(regionsDocs));

    // const mapsDocs = {};
    for (const floor of gw2Floors) {
      for (const region of Object.values(floor.regions)) {
        for (const map of Object.values(region.maps)) {
          gw2Maps[map.id] = {
            // adventures: Object.values(map.adventures).map(
            //   (adventure) => adventure.id
            // ),
            continent_id: continent.id,
            continent_rect: map.continent_rect,
            default_floor: map.default_floor,
            floors: (gw2Maps[map.id]?.floors ?? [])
              .concat([floor.id])
              .filter(filterUnique),
            id: map.id,
            label_coord: map.label_coord,
            map_rect: map.map_rect,
            // mastery_points: Object.values(map.mastery_points).map(
            //   (mastery_point) => mastery_point.id
            // ),
            max_level: map.max_level,
            min_level: map.min_level,
            name: map.name,
            // points_of_interest: Object.values(map.points_of_interest).map(
            //   (point_of_interest) => point_of_interest.id
            // ),
            region_id: map.region_id ?? region.id,
            // sectors: Object.values(map.sectors).map((sector) => sector.id),
            // skill_challenges: map.skill_challenges,
            // tasks: Object.values(map.tasks).map((task) => task.id),
          };
        }
      }
    }
  }

  console.log(`Putting maps in pouch`);
  await pouch.bulkDocs(Object.values(gw2Maps));
}

main();

function filterUnique(element, index, collection) {
  return index === collection.indexOf(element);
}
