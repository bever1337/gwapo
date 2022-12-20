import { Fragment } from "react";
// import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { MaterialsContainer } from "../../Containers/Materials/Container";
// import { classNames } from "../../../features/css/classnames";
import {
  readAccountMaterials,
  selectAccountMaterialsByCategory,
} from "../../../features/store/api/read-account-materials";
import { readMaterials } from "../../../features/store/api/read-materials";

const queryCacheArguments = {};

export function Materials() {
  const { data: materials } = readMaterials.useQuery({});
  readAccountMaterials.useQuery(queryCacheArguments);
  const accountMaterialsByCategory = useSelector(
    selectAccountMaterialsByCategory
  );
  return (
    <Fragment>
      {materials?.ids.map((materialId) => (
        <MaterialsContainer
          key={materialId}
          accountMaterials={accountMaterialsByCategory[materialId as number]}
          materials={materials.entities[materialId]!}
        />
      ))}
    </Fragment>
  );
}
