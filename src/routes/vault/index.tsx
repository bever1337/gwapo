import { FormattedMessage } from "react-intl";

import { Bank } from "../../components/Containers/Bank";
import { CharacterBags } from "../../components/Containers/Character";
import { SelectCharacter } from "../../components/SelectCharacter";
import { SharedInventory } from "../../components/Containers/SharedInventory";
import vaultGridClasses from "../../components/Vault/vault-grid.module.css";
import { classNames } from "../../features/css/classnames";

export function Vault() {
  return (
    <main className={classNames(vaultGridClasses["vault"])}>
      <h1 className={classNames(vaultGridClasses["vault__heading--1"])}>
        <FormattedMessage defaultMessage="Vault" />
      </h1>
      <div className={classNames(vaultGridClasses["vault__content--a"])}>
        <SelectCharacter />
        <SharedInventory />
        <CharacterBags />
      </div>
      <h2 className={classNames(vaultGridClasses["vault__heading--2"])}>
        <FormattedMessage defaultMessage="Bank" />
      </h2>
      <div className={classNames(vaultGridClasses["vault__content--b"])}>
        <Bank />
      </div>
    </main>
  );
}
