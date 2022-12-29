import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet } from "react-router-dom";

import { Materials as MaterialsContainers } from "../../../../Containers/Materials";
import vaultGridClasses from "../../../../Vault/vault-grid.module.css";

import { classNames } from "../../../../../features/css/classnames";

export function Materials() {
  return (
    <Fragment>
      <h2 className={classNames(vaultGridClasses["vault__heading--2"])}>
        <FormattedMessage defaultMessage="Materials Storage" />
      </h2>
      <div className={classNames(vaultGridClasses["vault__content--b"])}>
        <div
          // offset the height of an element in the contentA column
          style={{ height: "calc(0.5em + 1px)" }}
        />
        <MaterialsContainers />
      </div>
      <Outlet />
    </Fragment>
  );
}
