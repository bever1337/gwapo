import materialsClasses from "./material.module.css";

import type { AccountBankItem } from "../features/store/api/read-account-bank";
import type { Item } from "../types/item";

export function VaultItem(props: {
  accountBankItem: AccountBankItem | null;
  item?: Item;
}) {
  return (
    <li className={[materialsClasses["material__item"]].join(" ")}>
      <img
        className={[materialsClasses["material__img"]].join(" ")}
        alt={props.item?.name ?? ""}
        src={props.item?.icon}
      />
      {typeof props.accountBankItem?.count === "number" ? (
        <span className={[materialsClasses["material__count"]].join(" ")}>
          {props.accountBankItem.count}
        </span>
      ) : null}
    </li>
  );
}
