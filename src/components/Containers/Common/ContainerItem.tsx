import containerItemClasses from "./ContainerItem.module.css";

import itemTileClasses from "../../ItemTile/index.module.css";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import type { Item } from "../../../types/item";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;
const loadingImageSrc = `${process.env.PUBLIC_URL}/icons/System/loader-fill.svg`;

export function ContainerItem(props: {
  containerItem: {
    id: number;
    count: number;
  } | null;
  item?: Item;
}) {
  return (
    <li className={classNames(containerItemClasses["item"])}>
      <QueryUninitialized>
        <img
          className={classNames(
            containerItemClasses["item__img"],
            itemTileClasses["tile"]
          )}
          alt="loading"
          src={loadingImageSrc}
        />
      </QueryUninitialized>
      <QueryLoading>
        <img
          className={classNames(
            containerItemClasses["item__img"],
            itemTileClasses["tile"]
          )}
          alt="loading"
          src={loadingImageSrc}
        />
      </QueryLoading>
      <QueryError>
        <img
          className={classNames(
            containerItemClasses["item__img"],
            itemTileClasses["tile"]
          )}
          alt="error"
          src={errorImageSrc}
        />
      </QueryError>
      <QuerySuccess>
        <img
          className={classNames(
            containerItemClasses["item__img"],
            itemTileClasses["tile"],
            itemTileClasses[props.item?.rarity ?? ""]
          )}
          alt={props.item?.name ?? ""}
          src={props.containerItem ? props.item?.icon ?? errorImageSrc : ""}
        />
        {typeof props.containerItem?.count === "number" ? (
          <span className={classNames(containerItemClasses["item__count"])}>
            {props.containerItem.count}
          </span>
        ) : null}
      </QuerySuccess>
    </li>
  );
}
