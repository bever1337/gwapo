import materialClasses from "./material.module.css";

import { classNames } from "../features/css/classnames";
import type { AccountMaterial } from "../features/store/api/read-account-materials";
import type { Item } from "../types/item";

export function Material({
  accountMaterial,
  material,
}: {
  accountMaterial?: AccountMaterial;
  material: Item;
}) {
  return (
    <li className={classNames(materialClasses["material__item"])}>
      <img
        className={classNames(materialClasses["material__img"])}
        alt={material.name}
        src={material.icon}
      />
      <span className={classNames(materialClasses["material__count"])}>
        {accountMaterial?.count}
      </span>
    </li>
  );
}
