import React, { Fragment, useEffect, useState } from "react";

import { Material } from "./material";

import { pouch } from "../features/pouch";

interface Materials {
  id: number;
  items: number[];
  name: string;
  order: number;
}

interface Material {
  icon: `https://${string}`;
  id: number;
  name: string;
}

export function MaterialsTab({ materials }: { materials: Materials }) {
  const [items, setItems] = useState<Material[]>([]);
  useEffect(() => {
    pouch
      .allDocs({
        keys: materials.items.map((itemId) => `items_${itemId}`),
        include_docs: true,
      })
      .then((allDocsResponse) => {
        setItems(
          allDocsResponse.rows.map((row) => row.doc as unknown as Material)
        );
      })
      .catch(console.warn);
  }, [materials]);
  return (
    <Fragment>
      <h2>{materials.name}</h2>
      <ul>
        {items.map((item) => (
          <Material key={item.id} material={item} />
        ))}
      </ul>
    </Fragment>
  );
}
