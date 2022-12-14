import { Fragment, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { Materials } from "./routes/vault/materials";
import { Vault } from "./routes/vault";
import { VaultOutlet } from "./routes/vault/outlet";
import { VaultCharacterOutlet } from "./routes/vault/outlet-character";
import { store } from "./features/store";
import { updateGwapoDatabaseDump } from "./features/store/api/update-gwapo-database-dump";
import { Wardrobe } from "./routes/vault/wardrobe";

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <Fragment>
          <Authenticator />
          <hr />
          <Outlet />
        </Fragment>
      }
      path="/"
    >
      <Route element={<VaultOutlet />} path="vault">
        <Route element={<VaultCharacterOutlet />}>
          <Route element={<Vault />} index />
          <Route element={<Vault />} path=":characterName" />
          <Route element={<Materials />} path="materials" />
          <Route element={<Materials />} path="materials/:characterName" />
        </Route>
        <Route element={<Wardrobe />} path="wardrobe" />
      </Route>
    </Route>
  ),
  { basename: process.env.PUBLIC_URL }
);

export function App() {
  return (
    <Provider store={appStore}>
      <IntlProvider defaultLocale="en-US" locale="en-US">
        {/* <RunDatabaseDump /> */}
        <RouterProvider router={router} />
      </IntlProvider>
    </Provider>
  );
}
