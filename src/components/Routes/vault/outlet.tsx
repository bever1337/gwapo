import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link, Outlet } from "react-router-dom";

import vaultOutletClasses from "./outlet.module.css";

import hideClasses from "../../Elements/Hide.module.css";
import elementsClasses from "../../Elements/index.module.css";

import { classNames } from "../../../features/css/classnames";

const safe2FillSvg = `${process.env.PUBLIC_URL}/icons/Finance/safe-2-fill.svg`;
const gridFillSvg = `${process.env.PUBLIC_URL}/icons/Design/grid-fill.svg`;
// const shirtFillSvg = `${process.env.PUBLIC_URL}/icons/Others/shirt-fill.svg`;
const copperCoinFillSvg = `${process.env.PUBLIC_URL}/icons/Finance/copper-coin-fill.svg`;

export function VaultOutlet() {
  return (
    <Fragment>
      <div className={classNames(vaultOutletClasses["grid"])}>
        <h1 className={classNames(hideClasses["hide"])}>
          <FormattedMessage defaultMessage="Vault" />
        </h1>
        <nav
          className={classNames(
            elementsClasses["no-margin"],
            vaultOutletClasses["nav"]
          )}
        >
          <ul
            className={classNames(
              elementsClasses["no-margin"],
              elementsClasses["no-padding"],
              vaultOutletClasses["nav__list"]
            )}
          >
            <li className={classNames(vaultOutletClasses["nav__item"])}>
              <Link to="/vault/bank">
                <img
                  alt=""
                  className={classNames(vaultOutletClasses["nav__item__img"])}
                  src={safe2FillSvg}
                />
                <FormattedMessage defaultMessage="Bank" />
              </Link>
            </li>
            <li className={classNames(vaultOutletClasses["nav__item"])}>
              <Link to="/vault/materials">
                <img
                  alt=""
                  className={classNames(vaultOutletClasses["nav__item__img"])}
                  src={gridFillSvg}
                />
                <FormattedMessage defaultMessage="Materials" />
              </Link>
            </li>
            <li className={classNames(vaultOutletClasses["nav__item"])}>
              <Link to="/vault/wallet">
                <img
                  alt=""
                  className={classNames(vaultOutletClasses["nav__item__img"])}
                  src={copperCoinFillSvg}
                />
                <FormattedMessage defaultMessage="Wallet" />
              </Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </Fragment>
  );
}
