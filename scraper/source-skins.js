require("dotenv").config({ path: `${process.cwd()}/scraper/.env` });
const fs = require("fs");

const { fetch, PouchDB } = require("./common");

const BATCH_SIZE = 50;
const BATCH_STEP = 5;
const BATCH_TASK_MINIMUM_LENGTH = 1000;
const SKINS_URL = "https://api.guildwars2.com/v2/skins";

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
  const pouchName = `gwapo_${process.env.START_TIME}_skins`;
  const pouch = new PouchDB(pouchName, { adapter: "memory" });

  console.log("Fetching skin indices...");
  /** @type {integer[]} */
  const skinIds = await fetch(SKINS_URL).then((response) => response.json());
  const skinDocuments = [];
  const skinsManifest = {};
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
        gatekeptFetch(skinsBatchUrl).then((skinsList) => {
          const skinDocumentsBatch = skinsList.map((skin) => {
            const skinDocumentId = [
              "skin",
              skin.details?.type ?? skin.type,
              skin.details?.weight_class,
              skin.id,
            ]
              .filter((skinPartial) => !!skinPartial)
              .join("_");

            return {
              ...skin,
              _id: skinDocumentId,
              $id: "gwapo/skin",
            };
          });
          skinDocuments.push(...skinDocumentsBatch);
          return pouch.bulkDocs(skinDocumentsBatch);
        })
      );
    }
    await Promise.all(batch);
  }

  console.log("Creating skins manifest");
  for (let i = 0; i < skinDocuments.length; i++) {
    const skin = skinDocuments[i];
    switch (skin.type) {
      case "Armor": {
        if (skin.details.weight_class === "Clothing") {
          // no user-facing skins, filter out "Clothing"
          break;
        }
        skinsManifest.Armor ??= {
          _id: `skins_Armor`,
          $id: "gwapo/skins",
          id: "Armor",
          ids: ["Slot", "Weight"],
          Slot: [],
          Weight: [],
        };
        if (!skinsManifest.Armor.Slot.includes(skin.details.type)) {
          skinsManifest.Armor.Slot.push(skin.details.type);
        }
        if (!skinsManifest.Armor.Weight.includes(skin.details.weight_class)) {
          skinsManifest.Armor.Weight.push(skin.details.weight_class);
        }
        break;
      }
      case "Back": {
        skinsManifest["Back"] ??= {
          _id: `skins_Back`,
          $id: "gwapo/skins",
          id: "Back",
          ids: [],
        };
        break;
      }
      case "Gathering": {
        if (["Lure", "Bait"].includes(skin.details.type)) {
          // no user-facing skins, filter out "Lure" and "Bait"
          break;
        }
        skinsManifest.Gathering ??= {
          _id: `skins_Gathering`,
          $id: "gwapo/skins",
          id: "Gathering",
          ids: ["Tool"],
          Tool: [],
        };
        if (!skinsManifest.Gathering.Tool.includes(skin.details.type)) {
          skinsManifest.Gathering.Tool.push(skin.details.type);
        }
        break;
      }
      case "Weapon": {
        if (
          ["LargeBundle", "SmallBundle", "Toy", "ToyTwoHanded"].includes(
            skin.details.type
          )
        ) {
          // no user-facing skins, filter out "Lure" and "Bait"
          break;
        }
        skinsManifest.Weapon ??= {
          _id: `skins_Weapon`,
          $id: "gwapo/skins",
          id: "Weapon",
          ids: ["Type"],
          Type: [],
        };
        if (!skinsManifest.Weapon.Type.includes(skin.details.type)) {
          skinsManifest.Weapon.Type.push(skin.details.type);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  await pouch.bulkDocs(Object.values(skinsManifest));

  console.log("Dumping skins database");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump-skins.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
