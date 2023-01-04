const { emit } = require("process");
const { pouch } = require("./common");

//
// all skins
const detailed_type = {
  map: function mapSkinDetailedType(doc) {
    if (doc.$id === "gwapo/skin" && doc.type) {
      if (!doc.details) {
        // back
        emit(doc.type, doc);
        return;
      }
      if (doc.type === "Armor") {
        if (doc.details.weight_class === "Clothing") {
          return;
        }
        // weight_slot, e.g. Heavy_Shoulders
        emit(doc.details.type + "_" + doc.details.weight_class, doc);
        return;
      }
      emit(doc.details.type, doc);
    }
  }.toString(),
};

async function main() {
  pouch
    .get("_design/gw2_skins")
    .catch(() => {})
    .then((previousDesignDoc) => {
      return pouch.put({
        _id: "_design/gw2_skins",
        _rev: previousDesignDoc?._rev ?? undefined,
        views: {
          detailed_type,
        },
      });
    });
}

main();
