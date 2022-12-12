import { Fragment } from "react";
import { useSelector } from "react-redux";
import { CharacterBag } from "../../components/CharacterBag";

import { SelectCharacter } from "../../components/SelectCharacter";
import { VaultTab } from "../../components/vault-tab";
import {
  readAccountBank,
  selectReadAccountBankInScope,
  selectAccountBankWithTabs,
} from "../../features/store/api/read-account-bank";
import { readCharactersInventory } from "../../features/store/api/read-characters-inventory";

const skeletonBankTab = (
  <VaultTab accountBankItems={new Array(30).fill(null)} bankTab={0} />
);

export function Vault() {
  const skip = !useSelector(selectReadAccountBankInScope);
  readAccountBank.useQuery({}, { skip });
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  const [triggerReadCharactersInventory, { data: characterInventory = [] }] =
    readCharactersInventory.useLazyQuery();
  return (
    <Fragment>
      <h1>Account Vault</h1>
      <form
        onChange={(event) => {
          const characterName = new FormData(
            (event.target as HTMLInputElement | HTMLSelectElement).form!
          ).get("SelectCharacter");
          if (characterName) {
            triggerReadCharactersInventory({
              characterName: characterName as string,
            });
          }
        }}
      >
        <SelectCharacter />
      </form>
      {characterInventory.map((bag, index) => (
        <CharacterBag bagIndex={index} characterBag={bag} key={index} />
      ))}
      {accountBankTabs.length
        ? accountBankTabs.map((accountBankTab, accountBankTabIndex) => (
            // TODO
            // Warning: Does not support re-ordering! Using index as key!
            <VaultTab
              accountBankItems={accountBankTab}
              bankTab={accountBankTabIndex}
              key={accountBankTabIndex}
            />
          ))
        : skeletonBankTab}
    </Fragment>
  );
}
