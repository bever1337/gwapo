import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import accordionClasses from "../../Accordion/index.module.css";
import { MaterialsContainer } from "../../Containers/Materials/Container";
import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";
import { classNames } from "../../../features/css/classnames";
import {
  readAccountMaterials,
  selectAccountMaterialsByCategory,
} from "../../../features/store/api/read-account-materials";
import { readMaterials } from "../../../features/store/api/read-materials";

const queryCacheArguments = {};

export function Materials() {
  const readMaterialsResult = readMaterials.useQuery({});
  const { data: materials } = readMaterialsResult;
  readAccountMaterials.useQuery(queryCacheArguments);
  const accountMaterialsByCategory = useSelector(
    selectAccountMaterialsByCategory
  );
  return (
    <Query result={readMaterialsResult}>
      <QueryUninitialized>
        <section>
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              <FormattedMessage defaultMessage="Crafting Materials" />
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO is waiting to load materials" />
            </p>
          </div>
        </section>
      </QueryUninitialized>
      <QueryLoading>
        <section>
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              <FormattedMessage defaultMessage="Crafting Materials" />
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])} />
        </section>
      </QueryLoading>
      <QueryError>
        <section>
          <div className={classNames(accordionClasses["tab"])}>
            <h2
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              <FormattedMessage defaultMessage="Crafting Materials" />
            </h2>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO encountered an error loading materials." />
            </p>
          </div>
        </section>
      </QueryError>
      <QuerySuccess>
        {materials?.ids.map((materialId) => (
          <MaterialsContainer
            key={materialId}
            accountMaterials={accountMaterialsByCategory[materialId as number]}
            materials={materials.entities[materialId]!}
          />
        ))}
      </QuerySuccess>
    </Query>
  );
}
