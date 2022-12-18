import { skipToken } from "@reduxjs/toolkit/dist/query";

import elementsClasses from "../Elements/index.module.css";
import itemTileClasses from "../ItemTile/index.module.css";
import materialClasses from "../material.module.css";
import materialsClasses from "../materials.module.css";
import { Query } from "../Query";
import { QueryError } from "../Query/Error";
import { QueryLoading } from "../Query/Loading";
import { QuerySuccess } from "../Query/Success";
import { QueryUninitialized } from "../Query/Uninitialized";

import { classNames } from "../../features/css/classnames";
import type { SharedInventorySlot } from "../../features/store/api/read-account-inventory";
import { readItems } from "../../features/store/api/read-items";

const errorImageSrc = `${process.env.PUBLIC_URL}/icons/System/error-warning-fill.svg`;
const loadingImageSrc = `${process.env.PUBLIC_URL}/icons/System/loader-fill.svg`;

// Warning: shared inventory slots do not have any unique identifiers
// Features like filtering and sorting will not work until each item has a uid
// For now, we can assume this is safe because the list is static
export function SharedInventoryBag(props: {
  slots: (null | SharedInventorySlot)[];
}) {
  const itemIds = props.slots.reduce(
    (itemIds, item) => (item ? itemIds.concat([item.id]) : itemIds),
    [] as number[]
  );
  const skipReadItemsQuery = itemIds.length === 0;
  const readItemsResult = readItems.useQuery(
    skipReadItemsQuery ? skipToken : { ids: itemIds },
    { skip: skipReadItemsQuery }
  );
  return (
    <Query result={readItemsResult}>
      <ol
        className={classNames(
          materialsClasses["materials__list"],
          elementsClasses["no-margin"]
        )}
      >
        {props.slots.map((sharedInventoryItem, index) => {
          return (
            <li
              className={classNames(materialClasses["material__item"])}
              key={index}
            >
              <QueryUninitialized>
                <img
                  className={classNames(
                    materialClasses["material__img"],
                    itemTileClasses["tile"]
                  )}
                  alt="loading"
                  src={loadingImageSrc}
                />
              </QueryUninitialized>
              <QueryLoading>
                <img
                  className={classNames(
                    materialClasses["material__img"],
                    itemTileClasses["tile"]
                  )}
                  alt="loading"
                  src={loadingImageSrc}
                />
              </QueryLoading>
              <QueryError>
                <img
                  className={classNames(
                    materialClasses["material__img"],
                    itemTileClasses["tile"]
                  )}
                  alt="error"
                  src={errorImageSrc}
                />
              </QueryError>
              <QuerySuccess>
                <img
                  className={classNames(
                    materialClasses["material__img"],
                    itemTileClasses["tile"],
                    itemTileClasses[
                      readItemsResult.data?.entities?.[
                        sharedInventoryItem?.id ?? ""
                      ]?.rarity ?? ""
                    ]
                  )}
                  alt={
                    readItemsResult.data?.entities?.[
                      sharedInventoryItem?.id ?? ""
                    ]?.name ?? ""
                  }
                  src={
                    sharedInventoryItem
                      ? readItemsResult.data?.entities?.[
                          sharedInventoryItem?.id ?? ""
                        ]?.icon || errorImageSrc
                      : ""
                  }
                />
              </QuerySuccess>
              {typeof sharedInventoryItem?.count === "number" ? (
                <span
                  className={classNames(materialClasses["material__count"])}
                >
                  {sharedInventoryItem.count}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Query>
  );
}
