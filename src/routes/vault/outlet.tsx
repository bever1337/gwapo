import { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";

export function VaultOutlet() {
  return (
    <Fragment>
      <nav>
        <li>
          <Link to="/vault">vault</Link>
        </li>
        <li>
          <Link to="/vault/materials">materials</Link>
        </li>
        <li>
          <Link to="/vault/wardrobe">wardrobe</Link>
        </li>
      </nav>
      <Outlet />
    </Fragment>
  );
}
