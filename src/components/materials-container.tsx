import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MaterialsTab } from "./materials-tab";

import {
  readAccountMaterials,
  selectReadAccountMaterialsInScope,
  selectAccountMaterialsByCategory,
} from "../store/api/read-account-materials";
import { makeSelectIsInScope } from "../store/selectors";

import { pouch } from "../features/pouch";

const queryCacheArguments = {};

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
          $id: { $eq: "gwapo/materials" },
        },
        fields: ["id", "items", "name", "order"],
      })
      .then(({ docs }) => {
        setItems(docs as unknown as IMaterials[]);
      })
      .catch(console.warn);
  }, []);
  const skip = !useSelector(selectReadAccountMaterialsInScope);
  const readAccountMaterialsQuery = readAccountMaterials.useQuery(
    queryCacheArguments,
    { skip }
  );
  const accountMaterialsByCategory = useSelector(
    selectAccountMaterialsByCategory
  );
  return (
    <Fragment>
      <h1>Materials Storage</h1>
      {items
        .sort((a, b) => a.order - b.order)
        .map((materials) => (
          <MaterialsTab
            key={materials.id}
            accountMaterials={accountMaterialsByCategory[materials.id] ?? []}
            materials={materials}
          />
        ))}
    </Fragment>
  );
}
