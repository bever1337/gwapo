import { Fragment } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./App.css";
import { AppOutlet } from "./components/Routes/outlet";
import { Vault } from "./components/Routes/vault/_inventory/bank";
import { VaultBankItemDialog } from "./components/Routes/vault/_inventory/bank/:itemId";
import { Materials } from "./components/Routes/vault/_inventory/materials";
import { VaultMaterialsItemDialog } from "./components/Routes/vault/_inventory/materials/:itemId";
import { VaultInventoryOutlet } from "./components/Routes/vault/_inventory/outlet";
import { VaultOutlet } from "./components/Routes/vault/outlet";
import { VaultWallet } from "./components/Routes/vault/wallet";
import { Wardrobe } from "./components/Routes/vault/wardrobe";
import { store } from "./features/store";

const appStore = store();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppOutlet />}>
      <Route
        element={
          <Fragment>
            <nav>
              <Link to="/vault/bank">
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
        <Route element={<VaultInventoryOutlet />}>
          <Route element={<Vault />} path="bank">
            <Route element={<VaultBankItemDialog />} path=":itemId" />
          </Route>
          <Route element={<Materials />} path="materials">
            <Route element={<VaultMaterialsItemDialog />} path=":itemId" />
          </Route>
        </Route>
        <Route element={<VaultWallet />} path="wallet" />
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
        <RouterProvider router={router} />
      </IntlProvider>
    </Provider>
  );
}
