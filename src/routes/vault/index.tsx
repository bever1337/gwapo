import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { CharacterBag } from "../../components/CharacterBag";

import { AccountInventory } from "../../components/AccountInventory";
import { SelectCharacter } from "../../components/SelectCharacter";
import { VaultTab } from "../../components/vault-tab";
import {
  readAccountBank,
  selectReadAccountBankInScope,
  selectAccountBankWithTabs,
} from "../../features/store/api/read-account-bank";
import { readAccountInventory } from "../../features/store/api/read-account-inventory";
import { readCharactersInventory } from "../../features/store/api/read-characters-inventory";

export function Vault() {
  const skip = !useSelector(selectReadAccountBankInScope);
  readAccountBank.useQuery({}, { skip });
  const { data: accountInventory = [null, null] } =
    readAccountInventory.useQuery({}, { skip });
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  const [triggerReadCharactersInventory, readCharactersInventoryResult] =
    readCharactersInventory.useLazyQuery();
  useEffect(
    () => console.debug(readCharactersInventoryResult),
    [readCharactersInventoryResult]
  );

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
      <AccountInventory sharedInventory={accountInventory} />
      {(readCharactersInventoryResult.data ?? []).map((bag, index) => (
        <CharacterBag bagIndex={index} characterBag={bag} key={index} />
      ))}
      {accountBankTabs.map((accountBankTab, accountBankTabIndex) => (
        // TODO
        // Warning: Does not support re-ordering! Using index as key!
        <VaultTab
          accountBankItems={accountBankTab}
          bankTab={accountBankTabIndex}
          key={accountBankTabIndex}
        />
      ))}
    </Fragment>
  );
}
