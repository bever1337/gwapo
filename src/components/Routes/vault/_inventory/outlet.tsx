import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet } from "react-router-dom";

import { CharacterBags } from "../../../Containers/Character";
import { SelectCharacter } from "../../../SelectCharacter";
import { SharedInventory } from "../../../Containers/SharedInventory";
import vaultGridClasses from "../../../Vault/vault-grid.module.css";
import { classNames } from "../../../../features/css/classnames";

export function VaultInventoryOutlet() {
  return (
    <Fragment>
      <main className={classNames(vaultGridClasses["vault"])}>
        <h1 className={classNames(vaultGridClasses["vault__heading--1"])}>
          <FormattedMessage defaultMessage="Vault" />
        </h1>
        <div className={classNames(vaultGridClasses["vault__content--a"])}>
          <SelectCharacter />
          <div style={{ height: "0.5em" }} />
          <SharedInventory />
          <CharacterBags />
        </div>
        <Outlet />
      </main>
    </Fragment>
  );
}
