import { Fragment } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { CharacterBags } from "../../components/CharacterBags";
import { SelectCharacter } from "../../components/SelectCharacter";
import { SharedInventory } from "../../components/SharedInventory";

export function VaultCharacterOutlet() {
  const [, setParams] = useSearchParams();
  return (
    <Fragment>
      <form
        id="routerMonoForm"
        name="routerMonoForm"
        method="get"
        onChange={(event) => {
          // TODO, it would be convenient to persist these params when routing between /vault and /vault/materials
          setParams(
            new URLSearchParams(new FormData(event.currentTarget) as any)
          );
        }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <SelectCharacter />
        <SharedInventory />
        <CharacterBags />
        <hr style={{ margin: "2rem 0" }} />
        <Outlet />
      </form>
    </Fragment>
  );
}
