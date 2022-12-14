import { Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { AccountVault } from "../../components/AccountVault";
import { CharacterBags } from "../../components/CharacterBags";
import { SharedInventory } from "../../components/SharedInventory";
import { SelectCharacter } from "../../components/SelectCharacter";

export function Vault() {
  return (
    <Fragment>
      <h1>
        <FormattedMessage defaultMessage="Account Vault" />
      </h1>
      {/* <form
        onChange={(event) => {
          const characterName = new FormData(
            (event.target as HTMLInputElement | HTMLSelectElement).form!
          ).get("select_character");
          if (characterName) {
            setCharacterName(characterName as string);
          }
        }}
      > */}
      <SelectCharacter />
      {/* </form> */}
      <SharedInventory />
      <CharacterBags />
      <hr style={{ margin: "2rem 0" }} />
      <AccountVault />
    </Fragment>
  );
}
