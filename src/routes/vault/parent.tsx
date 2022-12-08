import { Outlet, Routes, Route } from "react-router-dom";

export function VaultParent() {
  return (
    <div id="vault-root-success">
      <Outlet />
    </div>
  );
}
