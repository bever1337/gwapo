import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useEffect, useRef } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";

import asideClasses from "./aside.module.css";

import containerItemClasses from "../Containers/Common/ContainerItem.module.css";
import elementsClasses from "../Elements/index.module.css";

import { classNames } from "../../features/css/classnames";
import { readItems } from "../../features/store/api/read-items";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultItemDialog(props: {}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const { data } = readItems.useQuery(
    itemId ? { ids: [parseInt(itemId, 10)] } : skipToken,
    { skip: !itemId }
  );
  const currentItem = data?.entities[itemId ?? ""];

  useEffect(() => {
    if (location.hash === "#aside") {
      contentRef.current?.scrollIntoView({
        behavior: "auto",
        inline: "end",
      });
    }
  }, [location.hash, location.key]);
  return (
    <aside className={classNames(asideClasses["aside"])}>
      <div className={classNames(asideClasses["sticky"])} ref={contentRef}>
        <div
          // offset the height of an element in the contentA column
          style={{ height: "calc(0.5em + 2px)" }}
        />
        <a href={`#${location.state?.from ?? ""}`}>back</a>
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
        <a href={`#${location.state?.from ?? ""}`}>back</a>
      </div>
    </aside>
  );
}