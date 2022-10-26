import React from "react";

interface Material {
  icon: `https://${string}`;
  id: number;
  name: string;
}

export function Material({ material }: { material: Material }) {
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
      {material.name}
      <img alt={material.name} src={material.icon} />
    </li>
  );
}
