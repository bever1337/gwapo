import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSearchParams, Link } from "react-router-dom";

import asideClasses from "./aside.module.css";

import containerItemClasses from "../Containers/Common/ContainerItem.module.css";
import elementsClasses from "../Elements/index.module.css";

import { classNames } from "../../features/css/classnames";
import { readItems } from "../../features/store/api/read-items";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultItemDialog(props: {}) {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const { data } = readItems.useQuery(
    itemId ? { ids: [parseInt(itemId, 10)] } : skipToken,
    { skip: !itemId }
  );
  const currentItem = data?.entities[itemId ?? ""];

  if (!itemId) return null;

  return (
    <aside className={classNames(asideClasses["aside"])}>
      <div className={classNames(asideClasses["sticky"])}>
        <div
          // offset the height of an element in the contentA column
          style={{ height: "calc(0.5em + 2px)" }}
        />
        <Link relative="path" to="./">
          back
        </Link>
        <img
          className={classNames(
            containerItemClasses["item__img"],
            containerItemClasses[currentItem?.rarity ?? ""]
          )}
          alt={currentItem?.name ?? ""}
          src={currentItem ? currentItem?.icon ?? errorImageSrc : ""}
          style={{ float: "left", margin: "0 1em 0.5em 0" }}
        />
        <h3 className={classNames(elementsClasses["no-margin"])}>
          {currentItem?.name}
        </h3>
        <p>{currentItem?.description}</p>
        <p>Type: {currentItem?.type}</p>
        <Link relative="path" to="./">
          back
        </Link>
      </div>
    </aside>
  );
}
