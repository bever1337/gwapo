const { emit } = require("process");
const { pouch } = require("./common");

//
// all skins
const detailed_type = {
  map: function mapSkinDetailedType(doc) {
    if (doc.$id === "gwapo/skins" && doc.type) {
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
// all skins
const types_with_detail = {
  map: function mapSkinDetailedType(doc) {
    if (doc.$id === "gwapo/skins" && doc.type) {
      if (!doc.details) {
        // back item?
        emit([doc.type], null);
        return;
      }

      if (doc.type === "Armor") {
        if (doc.details.weight_class === "Clothing") {
          // no user-facing skins, filter out "Clothing"
          return;
        }
        emit([doc.type, "Slot"], doc.details.type); // slot, weight
        emit([doc.type, "Weight"], doc.details.weight_class); // slot, weight
        return;
      }

      if (doc.type === "Gathering") {
        if (["Lure", "Bait"].includes(doc.details.type)) {
          // no user-facing skins, filter out "Lure" and "Bait"
          return;
        }
        emit([doc.type, "Tool"], doc.details.type);
        return;
      }

      if (doc.type === "Weapon") {
        if (
          ["LargeBundle", "SmallBundle", "Toy", "ToyTwoHanded"].includes(
            doc.details.type
          )
        ) {
          // no user-facing skins, filter out list
          return;
        }
        emit([doc.type, "Type"], doc.details.type);
        return;
      }

      emit([doc.type, "Type"], doc.details.type);
    }
  }.toString(),
  reduce: function reduceArmorSkinTypes(keys, values, rereduce) {
    return values.filter(function filterNullOrDuplicatedValues(
      value,
      index,
      collection
    ) {
      return value !== null && collection.indexOf(value) === index;
    });
  }.toString(),
};

//
// armor skins

//
// weapon skins

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
          types_with_detail,
        },
      });
    });
}

main();
