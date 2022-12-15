import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Outlet } from "react-router-dom";

export function VaultOutlet() {
  return (
    <Fragment>
      <nav>
        <li>
          <Link to="/vault">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/icons/Finance/safe-2-fill.svg`}
              style={{ height: "2rem", width: "2rem" }}
            />
            <FormattedMessage defaultMessage="Vault" />
          </Link>
        </li>
        <li>
          <Link to="/vault/materials">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/icons/Design/grid-fill.svg`}
              style={{ height: "2rem", width: "2rem" }}
            />
            <FormattedMessage defaultMessage="Materials" />
          </Link>
        </li>
        <li>
          <Link to="/vault/wallet">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/icons/Finance/copper-coin-fill.svg`}
              style={{ height: "2rem", width: "2rem" }}
            />
            <FormattedMessage defaultMessage="Wallet" />
          </Link>
        </li>
        <li>
          <Link to="/vault/wardrobe">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/icons/Others/shirt-fill.svg`}
              style={{ height: "2rem", width: "2rem" }}
            />
            <FormattedMessage defaultMessage="Wardrobe" />
          </Link>
        </li>
      </nav>
      <h1>
        <FormattedMessage defaultMessage="Account Vault" />
      </h1>
      <Outlet />
    </Fragment>
  );
}
