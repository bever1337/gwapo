import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import inventoryOutletClasses from "./outlet.module.css";

import vaultOutletClasses from "../outlet.module.css";

import containerItemClasses from "../../../Containers/Common/ContainerItem.module.css";
import hideClasses from "../../../Elements/Hide.module.css";
import elementsClasses from "../../../Elements/index.module.css";

import { classNames } from "../../../../features/css/classnames";
import { readItems } from "../../../../features/store/api/read-items";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;

export function VaultItemDialog(props: {}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const backHref =
    (location.state?.from ? `#${location.state.from}` : location.hash) || "";
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
    <aside
      className={classNames(
        vaultOutletClasses["aside"],
        inventoryOutletClasses["aside"],
        !itemId && hideClasses["hide--everywhere"]
      )}
      id="aside"
    >
      <div
        className={classNames(vaultOutletClasses["sticky"])}
        ref={contentRef}
      >
        {/* <div
          // offset the height of an element in the contentA column
          style={{ height: "calc(0.5em + 2px)" }}
        /> */}
        <a href={backHref}>back</a>
        <table className={classNames(vaultOutletClasses["details__table"])}>
          <thead>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"],
                  vaultOutletClasses["details__table__thead__header"]
                )}
                colSpan={2}
              >
                <h3 className={classNames(elementsClasses["no-margin"])}>
                  {currentItem?.name}
                  <img
                    alt={currentItem?.name ?? ""}
                    className={classNames(
                      containerItemClasses["item__img"],
                      vaultOutletClasses["details__table__thead__header__img"]
                    )}
                    src={currentItem ? currentItem?.icon ?? errorImageSrc : ""}
                  />
                </h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"]
                )}
              >
                Type
              </th>
              <td
                className={classNames(
                  vaultOutletClasses["details__table__cell"]
                )}
              >
                {currentItem?.type}
              </td>
            </tr>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"]
                )}
              >
                Rarity
              </th>
              <td
                className={classNames(
                  vaultOutletClasses["details__table__cell"]
                )}
              >
                {currentItem?.rarity}
              </td>
            </tr>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"]
                )}
              >
                Level
              </th>
              <td
                className={classNames(
                  vaultOutletClasses["details__table__cell"]
                )}
              >
                {currentItem?.level}
              </td>
            </tr>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"]
                )}
              >
                Chat link
              </th>
              <td
                className={classNames(
                  vaultOutletClasses["details__table__cell"]
                )}
              >
                {currentItem?.chat_link}
              </td>
            </tr>
            <tr>
              <th
                className={classNames(
                  vaultOutletClasses["details__table__header"]
                )}
              >
                Description
              </th>
              <td
                className={classNames(
                  vaultOutletClasses["details__table__cell"]
                )}
              >
                {currentItem?.description}
              </td>
            </tr>
          </tbody>
        </table>
        <a href={backHref}>back</a>
      </div>
    </aside>
  );
}
