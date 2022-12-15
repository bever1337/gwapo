const { emit } = require("process");
const { pouch } = require("./common");

async function main() {
  pouch.put({
    _id: "_design/gw2_skins",
    views: {
      // all skins
      by_type: {
        map: function mapSkinType(doc) {
          if (doc.$id === "gwapo/skins" && doc.type) {
            emit(doc.type);
          }
        }.toString(),
      },
      types: {
        map: function mapSkinTypes(doc) {
          if (doc.$id === "gwapo/skins" && doc.type) {
            emit(doc.type);
          }
        }.toString(),
        reduce: function reduceSkinTypes(doc) {
          return true;
        }.toString(),
      },
      by_detailed_type: {
        map: function mapSkinDetailedType(doc) {
          if (doc.$id === "gwapo/skins" && doc.details && doc.details.type) {
            emit(doc.details.type);
          }
        }.toString(),
      },
      detailed_types: {
        map: function mapSkinDetailedType(doc) {
          if (doc.$id === "gwapo/skins" && doc.details && doc.details.type) {
            emit(doc.details.type);
          }
        }.toString(),
        reduce: function reduceSkinDetailedTypes(doc) {
          return true;
        }.toString(),
      },
      // armor skins
      armor_by_weight_class: {
        map: function mapArmorByWeightClass(doc) {
          if (doc.$id === "gwapo/skins" && doc.type === "Armor") {
            emit(doc.details.weight_class);
          }
        }.toString(),
      },
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
}

main();
