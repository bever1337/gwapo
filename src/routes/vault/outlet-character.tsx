import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import { CharacterBags } from "../../components/CharacterBags";
import { SelectCharacter } from "../../components/SelectCharacter";
import { SharedInventory } from "../../components/SharedInventory";

export function VaultCharacterOutlet() {
  return (
    <Fragment>
      <SelectCharacter />
      <SharedInventory />
      <CharacterBags />
      <hr style={{ margin: "2rem 0" }} />
      <Outlet />
    </Fragment>
  );
}
