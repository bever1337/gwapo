import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { Materials } from "./routes/vault/materials";
import { WardrobeStorage } from "./routes/vault/wardrobe-storage";
import { Vault } from "./routes/vault";
import { VaultParent } from "./routes/vault/parent";
import { store } from "./store";
import { loadDatabase } from "./store/api/load-database";

const appStore = store();

function RunDatabaseDump() {
  const [trigger] = loadDatabase.useMutation({});
  useEffect(() => {
    const request = trigger({});
    return () => {
      request.abort();
    };
  }, [trigger]);
  return null;
}

export function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <RunDatabaseDump />
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
            <Route index element={<p>hello, world</p>} />
            <Route element={<VaultParent />} path="/vault">
              <Route element={<Vault />} index />
              <Route element={<Materials />} path="materials-storage/*" />
              <Route element={<WardrobeStorage />} path="wardrobe-storage/*" />
            </Route>
          </Routes>
        }
      </BrowserRouter>
    </Provider>
  );
}
