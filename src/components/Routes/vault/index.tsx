import { FormattedMessage } from "react-intl";

import { Bank } from "../../Containers/Bank";
import { CharacterBags } from "../../Containers/Character";
import { SelectCharacter } from "../../SelectCharacter";
import { SharedInventory } from "../../Containers/SharedInventory";
import vaultGridClasses from "../../Vault/vault-grid.module.css";
import { classNames } from "../../../features/css/classnames";

export function Vault() {
  return (
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
      <h2 className={classNames(vaultGridClasses["vault__heading--2"])}>
        <FormattedMessage defaultMessage="Bank" />
      </h2>
      <div className={classNames(vaultGridClasses["vault__content--b"])}>
        <div
          // offset the height of an element in the contentA column
          style={{ height: "calc(0.5em + 1px)" }}
        />
        <Bank />
      </div>
    </main>
  );
}
