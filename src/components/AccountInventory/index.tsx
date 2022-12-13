import { useState } from "react";

import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import type { SharedInventorySlot } from "../../features/store/api/read-account-inventory";
import { readItems } from "../../features/store/api/read-items";

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

export function AccountInventory(props: {
  sharedInventory: (SharedInventorySlot | null)[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: items } = readItems.useQuery({
    ids: props.sharedInventory.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  });
  const sharedInventoryElements = props.sharedInventory.map(
    (sharedInventoryItem, index) => (
      // Warning: bags do not have any unique identifiers
      // Features like filtering and sorting will not work until each item has a uid
      // For now, we can assume this is safe because the list is static
      <VaultItem
        accountBankItem={sharedInventoryItem}
        item={
          sharedInventoryItem
            ? items?.entities?.[sharedInventoryItem.id]
            : undefined
        }
        key={index}
      />
    )
  );
  return (
    <section
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <h2 className={[materialsClasses["materials__header"]].join(" ")}>
        Shared Inventory
      </h2>
      <label className={[materialsClasses["materials__control"]].join(" ")}>
        {collapsed ? TRIANGLE_CLOSED : TRIANGLE_OPEN}
        <input
          checked={collapsed}
          onChange={(event) => {
            setCollapsed(event.target.checked);
          }}
          name={`collapse-sharedInventory`}
          type="checkbox"
        />
      </label>
      <ol className={[materialsClasses["materials__list"]].join(" ")}>
        {collapsed ? null : sharedInventoryElements}
      </ol>
    </section>
  );
}
