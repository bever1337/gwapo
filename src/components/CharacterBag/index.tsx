import { useState } from "react";

import materialsClasses from "../materials.module.css";
import { VaultItem } from "../vault-item";

import { readItems } from "../../features/store/api/read-items";
import type { Bag } from "../../features/store/api/read-characters-inventory";

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

export function CharacterBag(props: { characterBag: Bag; bagIndex: number }) {
  const [collapsed, setCollapsed] = useState(false);
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
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <h2 className={[materialsClasses["materials__header"]].join(" ")}>
        {props.characterBag.id} ({props.characterBag.size} slots)
      </h2>
      <label className={[materialsClasses["materials__control"]].join(" ")}>
        {collapsed ? TRIANGLE_CLOSED : TRIANGLE_OPEN}
        <input
          checked={collapsed}
          onChange={(event) => {
            setCollapsed(event.target.checked);
          }}
          name={`collapse-${props.bagIndex}`}
          type="checkbox"
        />
      </label>
      <ol className={[materialsClasses["materials__list"]].join(" ")}>
        {collapsed ? null : characterBagItemElements}
      </ol>
    </section>
  );
}
