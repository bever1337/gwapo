import React from "react";

import classes from "./materials.module.css";

import type { AccountMaterial } from "../store/api/read-account-materials";

interface IMaterial {
  icon: `https://${string}`;
  id: number;
  name: string;
}

export function Material({
  accountMaterial,
  material,
}: {
  accountMaterial?: AccountMaterial;
  material: IMaterial;
}) {
  // const [items, setItems] = useState<Material[]>([]);
  // useEffect(() => {
  //   pouch
  //     .allDocs({
  //       keys: materials.items.map((itemId) => `items_${itemId}`),
  //       include_docs: true,
  //     })
  //     .then((allDocsResponse) => {
  //       setItems(
  //         allDocsResponse.rows.map((row) => row.doc as unknown as Material)
  //       );
  //     })
  //     .catch(console.warn);
  // }, [materials]);
  return (
    <li>
      <img
        className={[classes["material__img"]].join(" ")}
        alt={material.name}
        src={material.icon}
        title={`${accountMaterial?.count ?? "unknown"} qty`}
      />
    </li>
  );
}
