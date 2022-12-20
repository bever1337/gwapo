import containerItemClasses from "../../Containers/Common/ContainerItem.module.css";

import { classNames } from "../../../features/css/classnames";
import type { AccountMaterial } from "../../../features/store/api/read-account-materials";
import type { Item } from "../../../types/item";

// Different from common ContainerItem because material is always present unlike item
export function MaterialContainerItem({
  accountMaterial,
  material,
}: {
  accountMaterial?: AccountMaterial;
  material: Item;
}) {
  return (
    <li className={classNames(containerItemClasses["item"])}>
      <img
        className={classNames(containerItemClasses["item__img"])}
        alt={material.name}
        src={material.icon}
      />
      <span className={classNames(containerItemClasses["item__count"])}>
        {accountMaterial?.count}
      </span>
    </li>
  );
}
