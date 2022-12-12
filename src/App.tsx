import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { Materials } from "./routes/vault/materials";
import { Vault } from "./routes/vault";
import { VaultOutlet } from "./routes/vault/outlet";
import { store } from "./features/store";
import { updateGwapoDatabaseDump } from "./features/store/api/update-gwapo-database-dump";
import {
  readGwapoDatabaseProgress,
  selectProgress,
} from "./features/store/api/read-gwapo-database-progress";
import {
  selectBestDatabase,
  readGwapoDatabases,
} from "./features/store/api/read-gwapo-databases";

const appStore = store();

function RunDatabaseDump() {
  const [trigger] = updateGwapoDatabaseDump.useMutation({});
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
        {/* <RunDatabaseDump /> */}
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
          </ul>
        </nav>
        <hr />
        {
          <Routes>
            <Route index element={<p>hello, world</p>} />
            <Route element={<VaultOutlet />} path="/vault">
              <Route element={<Vault />} index />
              <Route element={<Materials />} path="materials-storage/*" />
            </Route>
          </Routes>
        }
      </BrowserRouter>
    </Provider>
  );
}
