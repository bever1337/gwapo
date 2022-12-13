import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import { classNames } from "../../features/css/classnames";
import { readItems } from "../../features/store/api/read-items";
import type { Bag } from "../../features/store/api/read-characters-inventory";

export function CharacterBag(props: {
  characterBag: Bag | null;
  bagIndex: number;
}) {
  const [open, setOpen] = useState(true);
  const skip = props.characterBag === null;
  const queryArguments = {
    ids:
      props.characterBag?.inventory.reduce(
        (acc, item) => (item ? acc.concat([item.id]) : acc),
        [props.characterBag.id] as number[]
      ) ?? [],
  };
  const { data: items } = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );
  return (
    <section
      className={classNames(materialsClasses["materials__inline-wrapper"])}
    >
      <div className={classNames(accordionClasses["tab"])}>
        <h2 className={classNames(accordionClasses["tab__heading"])}>
          {items?.entities[props.characterBag?.id ?? ""]?.name ?? ""}
        </h2>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <ol
        className={classNames(
          materialsClasses["materials__list"],
          !open && hideClasses["hide"]
        )}
      >
        {props.characterBag?.inventory.map((characterBagItem, index) => (
          // Warning: bags do not have any unique identifiers
          // Features like filtering and sorting will not work until each item has a uid
          // For now, we can assume this is safe because the list is static
          <VaultItem
            accountBankItem={characterBagItem}
            item={items?.entities?.[characterBagItem?.id ?? ""]}
            key={index}
          />
        ))}
      </ol>
    </section>
  );
}
