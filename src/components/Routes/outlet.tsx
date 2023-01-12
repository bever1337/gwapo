import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Outlet } from "react-router-dom";

import indexClasses from "./index.module.css";

import { Settings } from "../Settings";

import { classNames } from "../../features/css/classnames";

export function AppOutlet() {
  // declare string tempaltes outside JSX props for better syntax highlighting
  const homeImageSource = `${process.env.PUBLIC_URL}/icons/Buildings/home-2-fill.svg`;

  return (
    <Fragment>
      <header>
        <nav className={classNames(indexClasses["nav"])}>
          <div
            className={classNames(indexClasses["nav__item"])}
            style={{ gridArea: "home" }}
          >
            <Link to="/">
              <FormattedMessage defaultMessage="Home">
                {(nodes) => (
                  <img alt={nodes as any as string} src={homeImageSource} />
                )}
              </FormattedMessage>
              Gwapo
            </Link>
          </div>
          <ul className={classNames(indexClasses["nav__list"])}>
            <li className={classNames(indexClasses["nav__item"])}>
              <Link to="/pve/dungeons">
                <img
                  alt=""
                  src={process.env.PUBLIC_URL + "/icons/System/shield-fill.svg"}
                />
                <FormattedMessage defaultMessage="PvE" />
              </Link>
            </li>
            <li className={classNames(indexClasses["nav__item"])}>
              <Link to="/vault/bank">
                <img
                  alt=""
                  src={
                    process.env.PUBLIC_URL + "/icons/Finance/safe-2-fill.svg"
                  }
                />
                <FormattedMessage defaultMessage="Vault" />
              </Link>
            </li>
          </ul>
          <div style={{ gridArea: "settings" }}>
            <Settings />
          </div>
        </nav>
      </header>
      <Outlet />
    </Fragment>
  );
}
