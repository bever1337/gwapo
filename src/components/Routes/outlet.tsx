import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink, Outlet } from "react-router-dom";

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
          <ul className={classNames(indexClasses["nav__list"])}>
            <li>
              <NavLink
                className={({ isActive }) =>
                  classNames(
                    indexClasses["nav__item__link"],
                    isActive && indexClasses["nav__item__link--active"]
                  )
                }
                to="/"
              >
                <img alt="" src={homeImageSource} />
                Gwapo
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  classNames(
                    indexClasses["nav__item__link"],
                    isActive && indexClasses["nav__item__link--active"]
                  )
                }
                to="/pve"
              >
                <img
                  alt=""
                  src={process.env.PUBLIC_URL + "/icons/System/shield-fill.svg"}
                />
                <FormattedMessage defaultMessage="PvE" />
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  classNames(
                    indexClasses["nav__item__link"],
                    isActive && indexClasses["nav__item__link--active"]
                  )
                }
                to="/vault"
              >
                <img
                  alt=""
                  src={
                    process.env.PUBLIC_URL + "/icons/Finance/safe-2-fill.svg"
                  }
                />
                <FormattedMessage defaultMessage="Vault" />
              </NavLink>
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
