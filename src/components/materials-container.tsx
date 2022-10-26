import React, { Fragment, useEffect, useState } from "react";

import { MaterialsTab } from "./materials-tab";

import { pouch } from "../features/pouch";

interface IMaterials {
  id: number;
  items: number[];
  name: string;
  order: number;
}

export function MaterialsContainer() {
  const [items, setItems] = useState<IMaterials[]>([]);
  useEffect(() => {
    pouch
      .find({
        selector: {
          $id: { $eq: "materials" },
        },
        fields: ["id", "items", "name", "order"],
      })
      .then(({ docs }) => {
        setItems(docs as unknown as IMaterials[]);
      })
      .catch(console.warn);
  }, []);
  return (
    <Fragment>
      <h1>Materials Storage</h1>
      {items
        .sort((a, b) => a.order - b.order)
        .map((materials) => (
          <MaterialsTab key={materials.id} materials={materials} />
        ))}
    </Fragment>
  );
}
