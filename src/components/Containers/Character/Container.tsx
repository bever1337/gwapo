import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment, useState } from "react";

import containerClasses from "../Common/Container.module.css";
import { ContainerItem } from "../Common/ContainerItem";

import { AccordionControl } from "../../Accordion/Control";
import { AccordionHeading } from "../../Accordion/Heading";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import { Query } from "../../Query";

import { classNames } from "../../../features/css/classnames";
import { readItems } from "../../../features/store/api/read-items";
import type { Bag } from "../../../features/store/api/read-characters-inventory";

export function CharacterBagContainer(props: {
  characterBag: Bag;
  bagIndex: number;
}) {
  const [open, setOpen] = useState(true);
  const queryArguments = {
    ids: props.characterBag.inventory.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [props.characterBag.id] as number[]
    ),
  };
  const skip = queryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );
  return (
    <Fragment>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading onChange={setOpen}>
            {readItemsResult.data?.entities[props.characterBag?.id ?? ""]
              ?.name ?? ""}
          </AccordionHeading>
          <AccordionControl onChange={setOpen} open={open} />
        </div>
        <div
          className={classNames(
            !open && hideClasses["hide"],
            accordionClasses["folder"]
          )}
        >
          <ol
            className={classNames(
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            <Query result={readItemsResult}>
              {props.characterBag?.inventory.map((characterBagItem, index) => (
                // Warning: bag slots do not have any unique identifiers
                // Features like filtering and sorting will not work until each item has a uid
                // For now, we can assume this is safe because the list is static
                <ContainerItem
                  containerItem={characterBagItem}
                  item={
                    readItemsResult.data?.entities?.[characterBagItem?.id ?? ""]
                  }
                  key={index}
                />
              ))}
            </Query>
          </ol>
        </div>
      </section>
    </Fragment>
  );
}
