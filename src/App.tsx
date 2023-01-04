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

import { Index } from "./components/Routes";
import { AppOutlet } from "./components/Routes/outlet";
import { Dungeons } from "./components/Routes/pve/dungeons";
import { PveOutlet } from "./components/Routes/pve/outlet";
import { Vault } from "./components/Routes/vault/_inventory/bank";
import { Materials } from "./components/Routes/vault/_inventory/materials";
import { VaultInventoryOutlet } from "./components/Routes/vault/_inventory/outlet";
import { VaultOutlet } from "./components/Routes/vault/outlet";
import { VaultWallet } from "./components/Routes/vault/wallet";
import { Wardrobe } from "./components/Routes/vault/wardrobe";
import { store } from "./features/store";

const appStore = store();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppOutlet />}>
      <Route element={<Index />} index />
      <Route element={<PveOutlet />} path="pve">
        <Route element={<Dungeons />} path="dungeons" />
      </Route>
      <Route element={<VaultOutlet />} path="vault">
        <Route element={<VaultInventoryOutlet />} path="*">
          <Route element={<Vault />} path="bank" />
          <Route element={<Materials />} path="materials" />
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
