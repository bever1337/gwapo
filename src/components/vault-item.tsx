import itemTileClasses from "./ItemTile/index.module.css";
import materialClasses from "./material.module.css";

import { classNames } from "../features/css/classnames";
import type { AccountBankItem } from "../features/store/api/read-account-bank";
import type { Item } from "../types/item";

export function VaultItem(props: {
  accountBankItem: AccountBankItem | null;
  item?: Item;
}) {
  return (
    <li className={classNames(materialClasses["material__item"])}>
      <img
        className={classNames(
          materialClasses["material__img"],
          itemTileClasses["tile"],
          itemTileClasses[props.item?.rarity ?? ""]
        )}
        alt={props.item?.name ?? ""}
        src={props.item?.icon}
      />
      {typeof props.accountBankItem?.count === "number" ? (
        <span className={[materialClasses["material__count"]].join(" ")}>
          {props.accountBankItem.count}
        </span>
      ) : null}
    </li>
  );
}
