// import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { Fragment, useEffect, useState } from "react";
// import { useSelector } from "react-redux";

import classes from "./materials.module.css";
import { Skin } from "./skin";

// import {
//   readAccountMaterials,
//   selectReadAccountMaterialsInScope,
//   selectAccountMaterialsByCategory,
// } from "../store/api/read-account-materials";
// import { makeSelectIsInScope } from "../store/selectors";

import { pouch } from "../features/pouch";

const queryCacheArguments = {};

interface ISkins {
  id: number;
  icon: string;
  name: string;
  rarity: string;
}

export function WardrobeStorageContainer() {
  const [skins, setSkins] = useState<ISkins[]>([]);
  useEffect(() => {
    pouch
      .find({
        selector: {
          $id: { $eq: "gwapo/skins" },
        },
        fields: ["icon", "id", "name", "rarity", "type"],
      })
      .then(({ docs }) => {
        setSkins(docs as unknown as ISkins[]);
      })
      .catch(console.warn);
  }, []);
  // const skip = !useSelector(selectReadAccountMaterialsInScope);
  // const readAccountMaterialsQuery = readAccountMaterials.useQuery(
  //   queryCacheArguments,
  //   { skip }
  // );
  // const accountMaterialsByCategory = useSelector(
  //   selectAccountMaterialsByCategory
  // );
  return (
    <Fragment>
      <h1>Wardrobe Storage</h1>
      <section className={[classes["materials__inline-wrapper"]].join(" ")}>
        <span className={[classes["materials__header"]].join(" ")} />
        <span className={[classes["materials__control"]].join(" ")} />
        <ul className={[classes["materials__list"]].join(" ")}>
          {skins.map((skin) => (
            <Skin key={skin.id} skin={skin} />
          ))}
        </ul>
      </section>
    </Fragment>
  );
}
