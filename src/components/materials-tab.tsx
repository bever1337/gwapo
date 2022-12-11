import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { useState } from "react";

import { Material } from "./material";
import classes from "./materials.module.css";

import type { AccountMaterial } from "../store/api/read-account-materials";
import { readItems } from "../store/api/read-items";
import type { Materials } from "../store/api/read-materials";

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

export function MaterialsTab({
  accountMaterials,
  materials,
}: {
  accountMaterials?: { [index: number]: AccountMaterial };
  materials: Materials;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const skip = materials.items.length === 0;
  const { data: items } = readItems.useQuery(
    skip
      ? skipToken
      : {
          ids: materials.items.reduce(
            (acc, item) => (item ? acc.concat([item]) : acc),
            [] as number[]
          ),
        },
    { skip }
  );

  // console.log(materials.name, accountMaterials);
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
      <label className={[classes["materials__control"]].join(" ")}>
        {collapsed ? TRIANGLE_CLOSED : TRIANGLE_OPEN}
        <input
          checked={collapsed}
          onChange={(event) => {
            setCollapsed(event.target.checked);
          }}
          name={`collapse-${materials.name}`}
          type="checkbox"
        />
      </label>
      <ul className={[classes["materials__list"]].join(" ")}>
        {collapsed ? null : materialElements}
      </ul>
    </section>
  );
}
