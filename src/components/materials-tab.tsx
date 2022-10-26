import React, { Fragment, useEffect, useState } from "react";

import { Material } from "./material";
import classes from "./materials.module.css";

import { pouch } from "../features/pouch";

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

export function MaterialsTab({ materials }: { materials: IMaterials }) {
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
  return (
    <section>
      <h2>{materials.name}</h2>
      <label>
        {"\u25B2"}
        <input name={`collapse-${materials.name}`} type="checkbox" />
      </label>
      <ul className={[classes["materials__list"]].join(" ")}>
        {items.map((item) => (
          <Material key={item.id} material={item} />
        ))}
      </ul>
    </section>
  );
}
