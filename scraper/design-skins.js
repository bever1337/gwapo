const { emit } = require("process");
const { pouch } = require("./common");

//
// all skins
const detailed_type = {
  map: function mapSkinDetailedType(doc) {
    if (doc.$id === "gwapo/skins" && doc.type) {
      if (!doc.details) {
        emit(doc.type, doc);
        return;
      }
      if (doc.type === "Armor") {
        if (doc.details.weight_class === "Clothing") {
          return;
        }
        // weight_slot, e.g. Heavy_Shoulders
        emit(doc.details.weight_class + "_" + doc.details.type, doc);
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
        emit(doc.type, null);
        return;
      }

      if (doc.type === "Armor") {
        if (doc.details.weight_class === "Clothing") {
          return;
        }
        emit(doc.type, doc.details.weight_class);
        return;
      }

      if (doc.type === "Gathering") {
        if (["Lure", "Bait"].includes(doc.details.type)) {
          return;
        }
        emit(doc.type, doc.details.type);
        return;
      }

      if (doc.type === "Weapon") {
        if (
          ["LargeBundle", "SmallBundle", "Toy", "ToyTwoHanded"].includes(
            doc.details.type
          )
        ) {
          return;
        }
        emit(doc.type, doc.details.type);
        return;
      }

      emit(doc.type, doc.details.type);
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
const armor_slots = {
  map: function mapArmorSlots(doc) {
    if (doc.$id !== "gwapo/skins" || doc.type !== "Armor") {
      return;
    }
    emit(doc.details.type);
  }.toString(),
  reduce: function reduceArmorSlots() {
    return true;
  }.toString(),
};

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
          //
          // all skins
          detailed_type,
          types_with_detail,
          //
          // armor skins
          armor_slots,
          //
          // weapon skins
          //
        },
      });
    });
}

main();
