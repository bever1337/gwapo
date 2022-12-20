import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Outlet } from "react-router-dom";

import elementsClasses from "../../components/Elements/index.module.css";
import { classNames } from "../../features/css/classnames";

export function VaultOutlet() {
  return (
    <Fragment>
      <nav>
        <ul
          className={classNames(
            elementsClasses["no-margin"],
            elementsClasses["no-padding"]
          )}
          style={{
            listStyle: "none",
          }}
        >
          <li
            style={{
              display: "inline-block",
              margin: "0.5em",
              textAlign: "center",
            }}
          >
            <Link to="/vault">
              <img
                alt=""
                src={`${process.env.PUBLIC_URL}/icons/Finance/safe-2-fill.svg`}
                style={{ height: "3rem", width: "3rem" }}
              />
              <br />
              <FormattedMessage defaultMessage="Vault" />
            </Link>
          </li>
          <li
            style={{
              display: "inline-block",
              margin: "0.5em",
              textAlign: "center",
            }}
          >
            <Link to="/vault/materials">
              <img
                alt=""
                src={`${process.env.PUBLIC_URL}/icons/Design/grid-fill.svg`}
                style={{ height: "3rem", width: "3rem" }}
              />
              <br />
              <FormattedMessage defaultMessage="Materials" />
            </Link>
          </li>
          <li
            style={{
              display: "inline-block",
              margin: "0.5em",
              textAlign: "center",
            }}
          >
            <Link to="/vault/wallet">
              <img
                alt=""
                src={`${process.env.PUBLIC_URL}/icons/Finance/copper-coin-fill.svg`}
                style={{ height: "3rem", width: "3rem" }}
              />
              <br />
              <FormattedMessage defaultMessage="Wallet" />
            </Link>
          </li>
          <li
            style={{
              display: "inline-block",
              margin: "0.5em",
              textAlign: "center",
            }}
          >
            <Link to="/vault/wardrobe">
              <img
                alt=""
                src={`${process.env.PUBLIC_URL}/icons/Others/shirt-fill.svg`}
                style={{ height: "3rem", width: "3rem" }}
              />
              <br />
              <FormattedMessage defaultMessage="Wardrobe" />
            </Link>
          </li>
        </ul>
      </nav>
      <h1>
        <FormattedMessage defaultMessage="Vault" />
      </h1>
      <Outlet />
    </Fragment>
  );
}
