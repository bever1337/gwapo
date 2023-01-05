const { pouch } = require("./common");

const detailed_type = {
  map: function mapSkinDetailedType(doc) {
    if (doc.$id === "gwapo/achievements") {
      emit(doc.group);
      emit(doc.category);
    }
  }.toString(),
};

async function main() {
  pouch
    .get("_design/gw2_achievements")
    .catch(() => {})
    .then((previousDesignDoc) => {
      return pouch.put({
        _id: "_design/gw2_achievements",
        _rev: previousDesignDoc?._rev ?? undefined,
        views: {
          detailed_type,
        },
      });
    });
}

main();
