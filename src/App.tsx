import { Fragment, useEffect } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";

import { Authenticator } from "./components/authenticator";
import { store } from "./features/store";
import { updateGwapoDatabaseDump } from "./features/store/api/update-gwapo-database-dump";
import { Vault } from "./routes/vault";
import { Materials } from "./routes/vault/materials";
import { VaultOutlet } from "./routes/vault/outlet";
import { VaultCharacterOutlet } from "./routes/vault/outlet-character";
import { VaultWallet } from "./routes/vault/wallet";
import { WardrobeIndex } from "./routes/vault/wardrobe";
import { WardrobeBack } from "./routes/vault/wardrobe/back";
import { WardrobeOutlet } from "./routes/vault/wardrobe/outlet";
import { WardrobeCategoryType } from "./routes/vault/wardrobe/_category/_type";
import { VaultWardrobeArmorWeight } from "./routes/vault/wardrobe/armor/weight";

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
      <Route
        element={
          <Fragment>
            <nav>
              <Link to="/vault">
                <img
                  alt=""
                  src={
                    process.env.PUBLIC_URL + "/icons/Finance/safe-2-fill.svg"
                  }
                  style={{ height: "2rem", width: "2rem" }}
                />
                <FormattedMessage defaultMessage="Vault" />
              </Link>
            </nav>
          </Fragment>
        }
        index
      />
      <Route element={<VaultOutlet />} path="vault">
        <Route element={<VaultCharacterOutlet />}>
          <Route element={<Vault />} index />
          <Route element={<Vault />} path=":characterName" />
          <Route element={<Materials />} path="materials" />
          <Route element={<Materials />} path="materials/:characterName" />
        </Route>
        <Route element={<VaultWallet />} path="wallet" />
        <Route element={<WardrobeOutlet />} path="wardrobe">
          <Route element={<WardrobeIndex />} index />
          <Route element={<VaultWardrobeArmorWeight />} path="armor/:weight" />
          <Route element={<WardrobeBack />} path="back/*" />
          <Route element={<WardrobeCategoryType />} path="gathering/:type" />
          <Route element={<WardrobeCategoryType />} path="weapon/:type" />
          <Route element={<WardrobeIndex />} path="*" />
        </Route>
      </Route>
    </Route>
  ),
  { basename: process.env.PUBLIC_URL }
);

export function App() {
  return (
    <Provider store={appStore}>
      <IntlProvider defaultLocale="en-US" locale="en-US">
        <RunDatabaseDump />
        <RouterProvider router={router} />
      </IntlProvider>
    </Provider>
  );
}
