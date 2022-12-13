import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";

import { CharacterBag } from "../../components/CharacterBag";
import { SharedInventory } from "../../components/SharedInventory";
import { SelectCharacter } from "../../components/SelectCharacter";
import { VaultTab } from "../../components/VaultTab";
import {
  readAccountBank,
  // selectReadAccountBankInScope,
  selectAccountBankWithTabs,
} from "../../features/store/api/read-account-bank";
import { readCharactersInventory } from "../../features/store/api/read-characters-inventory";

export function Vault() {
  readAccountBank.useQuery({});
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  const [triggerReadCharactersInventory, readCharactersInventoryResult] =
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
      <SharedInventory />
      {(readCharactersInventoryResult.data ?? []).map((bag, index) => (
        <CharacterBag bagIndex={index} characterBag={bag} key={index} />
      ))}
      <hr style={{ margin: "2rem 0" }} />
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
