import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import containerClasses from "../Common/Container.module.css";
import { ContainerItem } from "../Common/ContainerItem";

import { AccordionControl } from "../../Accordion/Control";
import { AccordionHeading } from "../../Accordion/Heading";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import accordionClasses from "../../Accordion/index.module.css";
import { Query } from "../../Query";

import { classNames } from "../../../features/css/classnames";
import type { SharedInventorySlot } from "../../../features/store/api/read-account-inventory";
import { readItems } from "../../../features/store/api/read-items";

// Warning: shared inventory slots do not have any unique identifiers
// Features like filtering and sorting will not work until each item has a uid
// For now, we can assume this is safe because the list is static
export function SharedInventoryContainer(props: {
  slots: (null | SharedInventorySlot)[];
  index?: 0;
}) {
  const [open, setOpen] = useState(true);
  const queryArguments = {
    ids: props.slots.reduce(
      (itemIds, item) => (item ? itemIds.concat([item.id]) : itemIds),
      [] as number[]
    ),
  };
  const skipReadItemsQuery = queryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skipReadItemsQuery ? skipToken : queryArguments,
    { skip: skipReadItemsQuery }
  );
  return (
    <Fragment>
      <div className={classNames(accordionClasses["tab"])}>
        <AccordionHeading onChange={setOpen}>
          <FormattedMessage defaultMessage="Shared Inventory" />
        </AccordionHeading>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <ol
        className={classNames(
          !open && hideClasses["hide"],
          elementsClasses["no-margin"],
          accordionClasses["folder"],
          containerClasses["container"]
        )}
      >
        <Query result={readItemsResult}>
          {props.slots.map((sharedInventoryItem, index) => (
            // Warning: shared inventory slots do not have any unique identifiers
            // Features like filtering and sorting will not work until each item has a uid
            // For now, we can assume this is safe because the list is static
            <ContainerItem
              containerItem={sharedInventoryItem}
              item={
                readItemsResult.data?.entities?.[sharedInventoryItem?.id ?? ""]
              }
              key={index}
            />
          ))}
        </Query>
      </ol>
    </Fragment>
  );
}
