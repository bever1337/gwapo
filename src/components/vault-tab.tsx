import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";

import materialsClasses from "./materials.module.css";
import { VaultItem } from "./vault-item";

import type { AccountBankItem } from "../store/api/read-account-bank";
import { readItems } from "../store/api/read-items";

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

export function VaultTab(props: {
  accountBankItems: (AccountBankItem | null)[];
  bankTab: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const skip = props.accountBankItems.length === 0;
  const { data: items } = readItems.useQuery(
    skip
      ? skipToken
      : {
          ids: props.accountBankItems.reduce(
            (acc, item) => (item ? acc.concat([item.id]) : acc),
            [] as number[]
          ),
        },
    { skip }
  );
  const accountBankTabItemsElements = props.accountBankItems.map(
    (accountBankTabItem, index) => (
      // Warning: account bank items do not have any unique identifiers
      // Features like filtering and sorting will not work until each item has a uid
      // For now, we can assume this is safe because the list is static
      <VaultItem
        accountBankItem={accountBankTabItem}
        item={
          accountBankTabItem
            ? items?.entities?.[accountBankTabItem.id]
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
