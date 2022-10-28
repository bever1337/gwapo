import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { MapsContainer } from "./components/maps-container";
import { MaterialsContainer } from "./components/materials-container";
import { pouch } from "./features/pouch";
import { store } from "./store";

const appStore = store();

export function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    pouch
      .load(process.env.PUBLIC_URL + "/dump.txt")
      .then(() =>
        pouch.createIndex({
          index: { fields: ["$id", "rarity", "type"] },
        })
      )
      .then(() => {
        setReady(true);
      })
      .catch((err) => {
        console.warn("went wrong", err);
      });
  }, []);
  return (
    <Provider store={appStore}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <nav>
          <Authenticator />
          <Link to="/maps">maps</Link>
          <Link to="/materials-storage">storage</Link>
        </nav>
        <hr />
        {ready ? (
          <Routes>
            <Route element={<p>hello</p>} path="/" />
            <Route element={<MapsContainer />} path="/maps" />
            <Route element={<MaterialsContainer />} path="/materials-storage" />
          </Routes>
        ) : null}
      </BrowserRouter>
    </Provider>
  );
}
