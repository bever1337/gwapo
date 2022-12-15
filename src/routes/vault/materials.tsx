import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { MaterialsTab } from "../../components/MaterialsTab";
import {
  readAccountMaterials,
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
      <h2>
        <FormattedMessage defaultMessage="Materials Storage" />
      </h2>
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
