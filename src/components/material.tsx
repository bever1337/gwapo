import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import classes from "./material.module.css";

import type { AccountMaterial } from "../features/store/api/read-account-materials";
import type { Item } from "../types/item";

export function Material({
  accountMaterial,
  material,
}: {
  accountMaterial?: AccountMaterial;
  material: Item;
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
    <li className={[classes["material__item"]].join(" ")}>
      <img
        className={[classes["material__img"]].join(" ")}
        alt={material.name}
        src={material.icon}
      />
      {typeof accountMaterial?.count === "number" ? (
        <Link
          to={`${material.id}`}
          className={[classes["material__count"]].join(" ")}
        >
          {accountMaterial.count}
        </Link>
      ) : null}
      <Routes>
        <Route
          element={
            <dialog open style={{ position: "absolute", zIndex: 1 }}>
              <form method="dialog">
                <button type="submit">x</button>
              </form>
              <h3>{material.name}</h3>
              <p>{accountMaterial?.count ?? "unknown"} in bank</p>
            </dialog>
          }
          path={`${material.id}`}
        />
      </Routes>
    </li>
  );
}
