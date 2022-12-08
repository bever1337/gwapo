import { useEffect, useState } from "react";

import materialsClasses from "./materials.module.css";
import { VaultItem } from "./vault-item";

import { pouch } from "../features/pouch";
import type { AccountBankItem } from "../store/api/read-account-bank";
import { useAppSelector } from "../store/hooks";

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

interface IMaterial {
  icon: `https://${string}`;
  id: number;
  name: string;
}

export function VaultTab(props: {
  accountBankItems: (AccountBankItem | null)[];
  bankTab: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<IMaterial[]>([]);
  const accountBankTabItemsElements = props.accountBankItems.map(
    (accountBankTabItem, index) => (
      // Warning: account bank items do not have any unique identifiers
      // Features like filtering and sorting will not work until each item has a uid
      // For now, we can assume this is safe because the list is static
      <VaultItem accountBankItem={accountBankTabItem} key={index} />
    )
  );
  useEffect(() => {
    pouch
      .allDocs({
        keys: props.accountBankItems.reduce(
          (acc, accountBankTabItem, index, collection) =>
            accountBankTabItem &&
            collection.findIndex(
              (item) => item?.id === accountBankTabItem.id
            ) === index
              ? acc.concat([`items_${accountBankTabItem.id}`])
              : acc,
          [] as string[]
        ),
        include_docs: true,
      })
      .then((allDocsResponse) => {
        setItems(
          allDocsResponse.rows.map((row) => row.doc as unknown as IMaterial)
        );
      })
      .catch(console.warn);
  }, [props.accountBankItems]);
  console.log("iutems", items);
  return (
    <section
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <h2 className={[materialsClasses["materials__header"]].join(" ")}>
        tab {props.bankTab}
      </h2>
      <label className={[materialsClasses["materials__control"]].join(" ")}>
        {collapsed ? TRIANGLE_CLOSED : TRIANGLE_OPEN}
        <input
          checked={collapsed}
          onChange={(event) => {
            setCollapsed(event.target.checked);
          }}
          name={`collapse-${props.bankTab}`}
          type="checkbox"
        />
      </label>
      <ol className={[materialsClasses["materials__list"]].join(" ")}>
        {collapsed ? null : accountBankTabItemsElements}
      </ol>
    </section>
  );
}
