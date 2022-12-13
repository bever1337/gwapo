import { useState } from "react";

import { AccordionControl } from "../Accordion/Control";
import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import { classNames } from "../../features/css/classnames";
import { readItems } from "../../features/store/api/read-items";
import type { Bag } from "../../features/store/api/read-characters-inventory";

export function CharacterBag(props: { characterBag: Bag; bagIndex: number }) {
  const [open, setOpen] = useState(true);
  const { data: items } = readItems.useQuery({
    ids: props.characterBag.inventory.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  });
  const characterBagItemElements = props.characterBag.inventory.map(
    (characterBagItem, index) => (
      // Warning: bags do not have any unique identifiers
      // Features like filtering and sorting will not work until each item has a uid
      // For now, we can assume this is safe because the list is static
      <VaultItem
        accountBankItem={characterBagItem}
        item={
          characterBagItem ? items?.entities?.[characterBagItem.id] : undefined
        }
        key={index}
      />
    )
  );
  return (
    <section
      className={classNames(materialsClasses["materials__inline-wrapper"])}
    >
      <h2 className={classNames(materialsClasses["materials__header"])}>
        {props.characterBag.id} ({props.characterBag.size} slots)
      </h2>
      <AccordionControl onChange={setOpen} open={open} />
      <ol className={classNames(materialsClasses["materials__list"])}>
        {open ? characterBagItemElements : null}
      </ol>
    </section>
  );
}
