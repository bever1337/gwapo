import { Fragment } from "react";
import { useSelector } from "react-redux";

import { MaterialsTab } from "../../components/materials-tab";

import {
  readAccountMaterials,
  selectReadAccountMaterialsInScope,
  selectAccountMaterialsByCategory,
} from "../../features/store/api/read-account-materials";
import { readMaterials } from "../../features/store/api/read-materials";

const queryCacheArguments = {};

export function Materials() {
  const { data: materials } = readMaterials.useQuery({});
  const skip = !useSelector(selectReadAccountMaterialsInScope);
  readAccountMaterials.useQuery(queryCacheArguments, { skip });
  const accountMaterialsByCategory = useSelector(
    selectAccountMaterialsByCategory
  );
  return (
    <Fragment>
      <h1>Materials Storage</h1>
      {materials?.ids.map((materialId) => (
        <MaterialsTab
          key={materialId}
          accountMaterials={accountMaterialsByCategory[materialId as number]}
          materials={materials.entities[materialId]!}
        />
      ))}
    </Fragment>
  );
}
