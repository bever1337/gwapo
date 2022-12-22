import containerItemClasses from "../Common/ContainerItem.module.css";

import { classNames } from "../../../features/css/classnames";
import type { Skin } from "../../../features/store/api/read-skins";

export function SkinContainerItem(props: { skin: Skin }) {
  return (
    <li className={classNames(containerItemClasses["item"])}>
      <img
        className={classNames(
          containerItemClasses["item__img"],
          containerItemClasses[props.skin.rarity ?? ""]
        )}
        alt={props.skin.name ?? ""}
        src={props.skin.icon ?? ""}
      />
    </li>
  );
}
