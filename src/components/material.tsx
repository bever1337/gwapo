import materialClasses from "./material.module.css";

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
    <li className={[materialClasses["material__item"]].join(" ")}>
      <img
        className={[materialClasses["material__img"]].join(" ")}
        alt={material.name}
        src={material.icon}
      />
      {accountMaterial?.count}
    </li>
  );
}
