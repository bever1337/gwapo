import { FormattedMessage } from "react-intl";

import accordionClasses from "../../Accordion/index.module.css";
import { MaterialsContainer } from "../../Containers/Materials/Container";
import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";
import { classNames } from "../../../features/css/classnames";
import { readAccountMaterials } from "../../../features/store/api/read-account-materials";
import { readMaterials } from "../../../features/store/api/read-materials";

function Skeleton(props: { children: any }) {
  return (
    <section>
      <div className={classNames(accordionClasses["tab"])}>
        <h3
          className={classNames(
            accordionClasses["tab__heading"],
            elementsClasses["no-margin"]
          )}
        >
          <FormattedMessage defaultMessage="Crafting Materials" />
        </h3>
      </div>
      <div className={classNames(accordionClasses["folder"])}>
        {props.children}
      </div>
    </section>
  );
}

export function Materials() {
  readAccountMaterials.useQuerySubscription({});
  const readMaterialsResult = readMaterials.useQuery({});
  return (
    <Query result={readMaterialsResult}>
      <QueryUninitialized>
        <Skeleton>
          <p>
            <FormattedMessage defaultMessage="GWAPO is waiting to load crafting materials." />
          </p>
        </Skeleton>
      </QueryUninitialized>
      <QueryLoading>
        <Skeleton>
          <p>
            <FormattedMessage defaultMessage="GWAPO is loading crafting materials." />
          </p>
        </Skeleton>
      </QueryLoading>
      <QueryError>
        <Skeleton>
          <p>
            <FormattedMessage defaultMessage="GWAPO encountered an error loading crafting materials." />
          </p>
        </Skeleton>
      </QueryError>
      <QuerySuccess>
        {readMaterialsResult.data?.ids.map((materialId) => (
          <MaterialsContainer
            key={materialId}
            materials={readMaterialsResult.data?.entities[materialId]!}
          />
        ))}
      </QuerySuccess>
    </Query>
  );
}
