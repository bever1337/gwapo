const { fetch, gatekeptFetch, PouchDB } = require("./common");

const BATCH_SIZE = 200;
const BATCH_STEP = 5;

async function sourcerer({ handleDoc, gw2ApiUrl, singular, plural }) {
  const defaultHandleDoc = (gw2Entity, couchEntity) => {
    return {
      ...(couchEntity ?? {}),
      ...gw2Entity,
      _id: `${plural}_${gw2Entity.id}`,
      $id: `gwapo/${plural}`,
    };
  };
  const pouch = new PouchDB(`http://localhost:5984/gwapo`);
  const entityState = { ids: [], entities: {} };

  console.log(`Fetching ${singular} indicies...`);
  const entityIds = await fetch(gw2ApiUrl).then((response) => response.json());
  console.log(
    `Found ${entityIds.length} ${plural}, ${Math.ceil(
      entityIds.length / BATCH_SIZE
    )} fetches required.`
  );

  for (let i = 0; i < entityIds.length; i += BATCH_SIZE * BATCH_STEP) {
    const batch = [];
    for (
      let j = i;
      j < Math.min(i + BATCH_STEP * BATCH_SIZE, entityIds.length);
      j += BATCH_SIZE
    ) {
      console.log(
        `Fetched ${j} ${plural} so far. ${(
          (j / entityIds.length) *
          100
        ).toFixed(2)}% complete`
      );
      const entityIdsSlice = entityIds.slice(j, j + BATCH_SIZE);

      batch.push(
        Promise.all([
          gatekeptFetch(`${gw2ApiUrl}?ids=${entityIdsSlice.join(",")}`),
          pouch.allDocs({
            include_docs: true,
            keys: entityIdsSlice.map((entityId) => `${plural}_${entityId}`),
          }),
        ])
          .then(([gw2Entities, { rows: couchEntities }]) => {
            if (couchEntities.length !== gw2Entities.length) {
              console.error(couchEntities, gw2Entities);
              throw new Error("Unexpected result, mismatch queries");
            }
            return gw2Entities.map((gw2Entity, index) => {
              const couchEntity = couchEntities[index].doc;
              if (couchEntity && couchEntity?.id !== gw2Entity.id) {
                console.error(index, couchEntity, gw2Entity);
                throw new Error("Unexpected result, mismatch queries");
              }
              const document = (handleDoc ?? defaultHandleDoc)(
                gw2Entity,
                couchEntity
              );
              // needs clean-up
              entityState.ids.push(document._id);
              entityState.entities[document._id] = document;
              //
              return document;
            });
          })
          .then((result) => pouch.bulkDocs(result))
      );
    }
    await Promise.all(batch);
  }
  console.log(`Fetched ${entityIds.length} ${plural} so far. 100% complete`);

  return entityState;
}

module.exports.sourcerer = sourcerer;
