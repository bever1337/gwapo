import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";

import containerClasses from "../Common/Container.module.css";
import { MaterialContainerItem } from "./ContainerItem";

import { AccordionControl } from "../../Accordion/Control";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../HideA11y/index.module.css";
import { Query } from "../../Query";

import { classNames } from "../../../features/css/classnames";
import type { AccountMaterial } from "../../../features/store/api/read-account-materials";
import { readItems } from "../../../features/store/api/read-items";
import type { Materials } from "../../../features/store/api/read-materials";

export function MaterialsContainer({
  accountMaterials,
  materials,
}: {
  accountMaterials?: { [index: number]: AccountMaterial };
  materials: Materials;
}) {
  const [open, setOpen] = useState(true);

  const queryArguments = {
    ids: materials.items.reduce(
      (acc, item) => (item ? acc.concat([item]) : acc),
      [] as number[]
    ),
  };
  const skip = queryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );
  const { data: items } = readItemsResult;
  return (
    <section>
      <div className={classNames(accordionClasses["tab"])}>
        <h2
          className={classNames(
            accordionClasses["tab__heading"],
            elementsClasses["no-margin"]
          )}
        >
          {materials.name}
        </h2>
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
            {items?.ids.map((itemId) => (
              <MaterialContainerItem
                accountMaterial={accountMaterials?.[itemId as number]}
                key={itemId}
                material={items.entities[itemId]!}
              />
            ))}
          </Query>
        </ol>
      </div>
    </section>
  );
}
