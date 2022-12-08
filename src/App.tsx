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
import { loadDatabase } from "./store/api/load-database";

const appStore = store();

function Thing() {
  const [trigger] = loadDatabase.useMutation({});
  useEffect(() => {
    const foo = trigger({});
    return () => {
      foo.abort();
    };
  }, [trigger]);
  return null;
}

export function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Thing />
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
        {
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
        }
      </BrowserRouter>
    </Provider>
  );
}
