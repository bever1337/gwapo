import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Form, Outlet, useLocation, useSearchParams } from "react-router-dom";

import { CharacterBags } from "../../components/CharacterBags";
import { SelectCharacter } from "../../components/SelectCharacter";
import { SharedInventory } from "../../components/SharedInventory";

export function VaultCharacterOutlet() {
  const { pathname } = useLocation();
  const [, setParams] = useSearchParams();
  return (
    <Fragment>
      <Form
        action={pathname}
        id="routerMonoForm"
        name="routerMonoForm"
        method="get"
        onChange={(event) => {
          setParams(
            new URLSearchParams(new FormData(event.currentTarget) as any)
          );
        }}
      >
        <h1>
          <FormattedMessage defaultMessage="Account Vault" />
        </h1>
        <SelectCharacter />
        <SharedInventory />
        <CharacterBags />
        <hr style={{ margin: "2rem 0" }} />
        <Outlet />
      </Form>
    </Fragment>
  );
}
