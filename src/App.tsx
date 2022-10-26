import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

// import { RarityTab } from "./components/rarity-tab";
import { MaterialsContainer } from "./components/materials-container";
import { pouch } from "./features/pouch";
import { store } from "./store";

const appStore = store();

// const ddoc = {
//   _id: "_design/items",
//   views: {
//     index: {
//       map: function mapFun(doc: any) {
//         // if (doc.title) {
//         /// @ts-ignore
//         emit("apricot");
//         // }
//       }.toString(),
//     },
//   },
// };

// const rarities = [
//   "Junk",
//   "Basic",
//   "Fine",
//   "Masterwork",
//   "Rare",
//   "Exotic",
//   "Ascended",
//   "Legendary",
// ];

export function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // pouch
    //   .load(process.env.PUBLIC_URL + "/dump.txt")
    //   .then(() =>
    //     pouch.createIndex({
    //       index: { fields: ["$id", "rarity", "type"] },
    //     })
    //   )
    pouch
      .createIndex({
        index: { fields: ["$id", "rarity", "type"] },
      })
      .then(() => {
        setReady(true);
      })
      .catch((err) => {
        console.warn("went wrong", err);
      });
  }, []);
  return (
    <Provider store={appStore}>
      {ready ? <MaterialsContainer /> : null}
    </Provider>
  );
}
