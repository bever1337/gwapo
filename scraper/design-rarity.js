const { emit } = require("process");
const { pouch } = require("./common");

async function main() {
  pouch
    .get("_design/gw2_skins")
    .catch(() => {})
    .then((previousDesignDoc) => {
      return pouch.put({
        _id: "_design/gw2_skins",
        _rev: previousDesignDoc?._rev ?? undefined,
        views: {
          // all skins
          // by_type: {
          //   map: function mapSkinType(doc) {
          //     if (doc.$id === "gwapo/skins" && doc.type) {
          //       emit(doc.type);
          //     }
          //   }.toString(),
          // },
          // types: {
          //   map: function mapSkinTypes(doc) {
          //     if (doc.$id === "gwapo/skins" && doc.type) {
          //       emit(doc.type);
          //     }
          //   }.toString(),
          //   reduce: function reduceSkinTypes(doc) {
          //     return true;
          //   }.toString(),
          // },
          // by_detailed_type: {
          //   map: function mapSkinDetailedType(doc) {
          //     if (doc.$id === "gwapo/skins" && doc.details && doc.details.type) {
          //       emit(doc.details.type);
          //     }
          //   }.toString(),
          // },
          // armor skins
          armor_by_type_and_weight: {
            map: function armorByTypeAndWeight(doc) {
              if (
                doc.$id === "gwapo/skins" &&
                doc.type === "Armor" &&
                doc.details &&
                doc.details.type &&
                doc.details.weight_class
              ) {
                emit(doc.details.type + "_" + doc.details.weight_class);
                emit(doc.details.type);
                emit(doc.details.weight_class);
              }
            }.toString(),
          },
          armor_slots: {
            map: function mapSkinDetailedType(doc) {
              if (
                doc.$id === "gwapo/skins" &&
                doc.type === "Armor" &&
                doc.details &&
                doc.details.type
              ) {
                emit(doc.details.type);
              }
            }.toString(),
            reduce: function reduceSkinDetailedTypes(doc) {
              return true;
            }.toString(),
          },
          // armor_by_weight_class: {
          //   map: function mapArmorByWeightClass(doc) {
          //     if (doc.$id === "gwapo/skins" && doc.type === "Armor") {
          //       emit(doc.details.type);
          //       emit(doc.details.weight_class);
          //     }
          //   }.toString(),
          // },
          armor_weight_classes: {
            map: function mapArmorByWeightClass(doc) {
              if (doc.$id === "gwapo/skins" && doc.type === "Armor") {
                emit(doc.details.weight_class);
              }
            }.toString(),
            reduce: function reduceArmorWeightClasses(doc) {
              return true;
            }.toString(),
          },
        },
      });
    });
}

main();
