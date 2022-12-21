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
import { store } from "./features/store";
import { AppOutlet } from "./routes/outlet";
import { Vault } from "./routes/vault";
import { Materials } from "./routes/vault/materials";
import { VaultOutlet } from "./routes/vault/outlet";
import { VaultWallet } from "./routes/vault/wallet";
import { Wardrobe } from "./routes/vault/wardrobe";

const appStore = store();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppOutlet />} path="/">
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
        <Route element={<Vault />} index />
        <Route element={<Materials />} path="materials" />
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
