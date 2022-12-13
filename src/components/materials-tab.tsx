import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { useState } from "react";

import { AccordionControl } from "./Accordion/Control";
import { Material } from "./material";
import classes from "./materials.module.css";

import type { AccountMaterial } from "../features/store/api/read-account-materials";
import { readItems } from "../features/store/api/read-items";
import type { Materials } from "../features/store/api/read-materials";

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

  const materialElements = items?.ids.map((itemId) => (
    <Material
      accountMaterial={accountMaterials?.[itemId as number]}
      key={itemId}
      material={items.entities[itemId]!}
    />
  ));

  return (
    <section className={[classes["materials__inline-wrapper"]].join(" ")}>
      <h2 className={[classes["materials__header"]].join(" ")}>
        {materials.name}
      </h2>
      <AccordionControl onChange={setOpen} open={open} />
      <ul className={[classes["materials__list"]].join(" ")}>
        {open ? materialElements : null}
      </ul>
    </section>
  );
}
