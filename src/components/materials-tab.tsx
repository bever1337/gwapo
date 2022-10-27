import React, { useEffect, useState } from "react";

import { Material } from "./material";
import classes from "./materials.module.css";

import { pouch } from "../features/pouch";

import type { AccountMaterial } from "../store/api/read-account-materials";

interface IMaterials {
  id: number;
  items: number[];
  name: string;
  order: number;
}

interface IMaterial {
  icon: `https://${string}`;
  id: number;
  name: string;
}

const TRIANGLE_CLOSED = "\u25B2";
const TRIANGLE_OPEN = "\u25BC";

export function MaterialsTab({
  accountMaterials,
  materials,
}: {
  accountMaterials: { [index: number]: AccountMaterial };
  materials: IMaterials;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<IMaterial[]>([]);
  useEffect(() => {
    pouch
      .allDocs({
        keys: materials.items.map((itemId) => `items_${itemId}`),
        include_docs: true,
      })
      .then((allDocsResponse) => {
        setItems(
          allDocsResponse.rows.map((row) => row.doc as unknown as IMaterial)
        );
      })
      .catch(console.warn);
  }, [materials]);
  // console.log(materials.name, accountMaterials);
  const materialElements = items.map((item) => (
    <Material
      accountMaterial={accountMaterials[item.id]}
      key={item.id}
      material={item}
    />
  ));
  return (
    <section className={[classes["materials__section"]].join(" ")}>
      <div className={[classes["materials__nav"]].join(" ")}>
        <h2 className={[classes["materials__name"]].join(" ")}>
          {materials.name}
        </h2>
        <label>
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
      </div>
      <ul className={[classes["materials__list"]].join(" ")}>
        {collapsed ? null : materialElements}
      </ul>
    </section>
  );
}
