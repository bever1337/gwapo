import { FormattedMessage } from "react-intl";

import { CharacterBags } from "../../components/Containers/Character";
import { Materials as MaterialsContainers } from "../../components/Containers/Materials";
import { SelectCharacter } from "../../components/SelectCharacter";
import { SharedInventory } from "../../components/Containers/SharedInventory";
import vaultGridClasses from "../../components/Vault/vault-grid.module.css";
import { classNames } from "../../features/css/classnames";

export function Materials() {
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
        <FormattedMessage defaultMessage="Materials Storage" />
      </h2>
      <div className={classNames(vaultGridClasses["vault__content--b"])}>
        <MaterialsContainers />
      </div>
    </main>
  );
}
