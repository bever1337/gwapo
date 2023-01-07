import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Index } from ".";
import { AppOutlet } from "./outlet";
import { PveDungeons } from "./pve/dungeons";
import { PveOutlet } from "./pve/outlet";
import { VaultBank } from "./vault/_inventory/bank";
import { VaultMaterials } from "./vault/_inventory/materials";
import { VaultInventoryOutlet } from "./vault/_inventory/outlet";
import { VaultOutlet } from "./vault/outlet";
import { VaultWallet } from "./vault/wallet";
import { VaultWardrobe } from "./vault/wardrobe";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppOutlet />}>
      <Route element={<Index />} index />
      <Route element={<PveOutlet />} path="pve">
        <Route element={<PveDungeons />} path="dungeons" />
      </Route>
      <Route element={<VaultOutlet />} path="vault">
        <Route element={<VaultInventoryOutlet />} path="*">
          <Route element={<VaultBank />} path="bank" />
          <Route element={<VaultMaterials />} path="materials" />
        </Route>
        <Route element={<VaultWallet />} path="wallet" />
        <Route element={<VaultWardrobe />} path="wardrobe" />
      </Route>
    </Route>
  ),
  { basename: process.env.PUBLIC_URL }
);

export function RoutesProvider() {
  return <RouterProvider router={router} />;
}
