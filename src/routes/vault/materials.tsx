import { Fragment } from "react";
import { useSelector } from "react-redux";

import { CharacterBags } from "../../components/CharacterBags";
import { MaterialsTab } from "../../components/MaterialsTab";
import { SelectCharacter } from "../../components/SelectCharacter";

import {
  readAccountMaterials,
  // selectReadAccountMaterialsInScope,
  selectAccountMaterialsByCategory,
} from "../../features/store/api/read-account-materials";
import { readMaterials } from "../../features/store/api/read-materials";

const queryCacheArguments = {};

export function Materials() {
  const { data: materials } = readMaterials.useQuery({});
  readAccountMaterials.useQuery(queryCacheArguments);
  const accountMaterialsByCategory = useSelector(
    selectAccountMaterialsByCategory
  );
  return (
    <Fragment>
      <h1>Materials Storage</h1>
      <SelectCharacter />
      <CharacterBags />
      <hr style={{ margin: "2rem 0" }} />
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
