import { useState } from "react";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import type { SharedInventorySlot } from "../../features/store/api/read-account-inventory";
import { readItems } from "../../features/store/api/read-items";
import { classNames } from "../../features/css/classnames";

export function SharedInventory(props: {
  sharedInventory: (SharedInventorySlot | null)[];
}) {
  const [open, setOpen] = useState(true);
  const { data: items } = readItems.useQuery({
    ids: props.sharedInventory.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  });
  return (
    <section
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <div className={classNames(accordionClasses["tab"])}>
        <h2 className={classNames(accordionClasses["tab__heading"])}>
          Shared Inventory
        </h2>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <ol
        className={classNames(
          materialsClasses["materials__list"],
          !open && hideClasses["hide"]
        )}
      >
        {props.sharedInventory.map((sharedInventoryItem, index) => (
          // Warning: shared inventory slots do not have any unique identifiers
          // Features like filtering and sorting will not work until each item has a uid
          // For now, we can assume this is safe because the list is static
          <VaultItem
            accountBankItem={sharedInventoryItem}
            item={items?.entities?.[sharedInventoryItem?.id ?? ""]}
            key={index}
          />
        ))}
      </ol>
    </section>
  );
}
