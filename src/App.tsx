import { Fragment, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import {
  BrowserRouter,
  createBrowserRouter,
  Link,
  Routes,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { Materials } from "./routes/vault/materials";
import { Vault } from "./routes/vault";
import { VaultOutlet } from "./routes/vault/outlet";
import { store } from "./features/store";
import { updateGwapoDatabaseDump } from "./features/store/api/update-gwapo-database-dump";

import {
  readCharacters,
  selectReadCharactersInScope,
} from "./features/store/api/read-characters";

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

function Demo() {
  const skip = !useSelector(selectReadCharactersInScope);
  readCharacters.useQuery({}, { skip });
  return null;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <Fragment>
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
          <Outlet />
        </Fragment>
      }
      path="/"
    >
      <Route element={<VaultOutlet />} path="vault">
        <Route element={<Vault />} index />
        <Route element={<Materials />} path="materials-storage/*" />
      </Route>
    </Route>
  ),
  { basename: process.env.PUBLIC_URL }
);

export function App() {
  return (
    <Provider store={appStore}>
      {/* <RunDatabaseDump /> */}
      <Demo />

      <RouterProvider router={router} />
    </Provider>
  );
}
