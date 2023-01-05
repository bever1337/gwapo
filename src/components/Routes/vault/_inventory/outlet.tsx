import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet, Routes, Route } from "react-router-dom";

import inventoryOutletClasses from "./outlet.module.css";

import vaultOutletClasses from "../outlet.module.css";

import { CharacterBags } from "../../../Containers/Character";
import elementsClasses from "../../../Elements/index.module.css";
import { SelectCharacter } from "../../../SelectCharacter";
import { SharedInventory } from "../../../Containers/SharedInventory";
import { VaultItemDialog } from "./itemId";
import { classNames } from "../../../../features/css/classnames";

export function VaultInventoryOutlet() {
  return (
    <Fragment>
      <h2
        className={classNames(
          elementsClasses["no-margin"],
          vaultOutletClasses["heading--2"]
        )}
      >
        <Routes>
          <Route
            path="bank/*"
            element={<FormattedMessage defaultMessage="Bank" />}
          />
          <Route
            path="materials/*"
            element={<FormattedMessage defaultMessage="Materials Storage" />}
          />
        </Routes>
      </h2>
      <main
        className={classNames(
          vaultOutletClasses["main"],
          inventoryOutletClasses["main"]
        )}
      >
        <div style={{ gridArea: "a" }}>
          <SelectCharacter />
          <div style={{ height: "0.5em" }} />
          <SharedInventory />
          <CharacterBags />
        </div>
        <div style={{ gridArea: "b" }}>
          <div
            // offset the height of an element in the contentA column
            style={{ height: "calc(0.5em + 2px)" }}
          />
          <Outlet />
        </div>
        <VaultItemDialog />
      </main>
    </Fragment>
  );
}
