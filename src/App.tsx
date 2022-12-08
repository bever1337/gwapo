import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import { Authenticator } from "./components/authenticator";
// import { MapsContainer } from "./components/maps-container";
import { MaterialsContainer } from "./components/materials-container";
import { WardrobeStorageContainer } from "./components/wardrobe-storage-container";
import { pouch } from "./features/pouch";
import { Vault } from "./routes/vault";
import { VaultParent } from "./routes/vault/parent";
import { store } from "./store";

const appStore = store();

export function App() {
  const [ready, setReady] = useState(true);
  // useEffect(() => {
  //   pouch
  //     .load(process.env.PUBLIC_URL + "/dump.txt")
  //     .then(() =>
  //       pouch.createIndex({
  //         index: { fields: ["$id", "rarity", "type"] },
  //       })
  //     )
  //     .then(() => {
  //       setReady(true);
  //     })
  //     .catch((err) => {
  //       console.warn("went wrong", err);
  //     });
  // }, []);
  return (
    <Provider store={appStore}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <nav>
          <ul>
            <li>
              <Authenticator />
            </li>
            <li>
              <Link to="/vault">vault</Link>
            </li>
            <li>
              <Link to="/vault/materials-storage">materials storage</Link>
            </li>
            <li>
              <Link to="/vault/wardrobe-storage">wardrobe storage</Link>
            </li>
          </ul>
        </nav>
        <hr />
        {ready ? (
          <Routes>
            <Route index element={<p>hello</p>} />
            {/* <Route element={<MapsContainer />} path="maps" /> */}
            <Route element={<VaultParent />} path="/vault">
              <Route element={<Vault />} index />
              <Route
                element={<MaterialsContainer />}
                path="materials-storage/*"
              />
              <Route
                element={<WardrobeStorageContainer />}
                path="wardrobe-storage/*"
              />
            </Route>
          </Routes>
        ) : null}
      </BrowserRouter>
    </Provider>
  );
}
