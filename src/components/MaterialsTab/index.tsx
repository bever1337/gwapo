import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { useState } from "react";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import { Material } from "../material";
import materialsClasses from "../materials.module.css";

import { classNames } from "../../features/css/classnames";
import type { AccountMaterial } from "../../features/store/api/read-account-materials";
import { readItems } from "../../features/store/api/read-items";
import type { Materials } from "../../features/store/api/read-materials";

export function MaterialsTab({
  accountMaterials,
  materials,
}: {
  accountMaterials?: { [index: number]: AccountMaterial };
  materials: Materials;
}) {
  const [open, setOpen] = useState(true);

  const skip = materials.items.length === 0;
  const queryArguments = {
    ids: materials.items.reduce(
      (acc, item) => (item ? acc.concat([item]) : acc),
      [] as number[]
    ),
  };
  const { data: items } = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );

  return (
    <section
      className={[materialsClasses["materials__inline-wrapper"]].join(" ")}
    >
      <div className={classNames(accordionClasses["tab"])}>
        <h2 className={classNames(accordionClasses["tab__heading"])}>
          {materials.name}
        </h2>
        <AccordionControl onChange={setOpen} open={open} />
      </div>
      <ol
        className={classNames(
          materialsClasses["materials__list"],
          !open && hideClasses["hide"]
        )}
      >
        {items?.ids.map((itemId) => (
          <Material
            accountMaterial={accountMaterials?.[itemId as number]}
            key={itemId}
            material={items.entities[itemId]!}
          />
        ))}
      </ol>
    </section>
  );
}
