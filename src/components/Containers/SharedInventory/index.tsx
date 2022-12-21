import { FormattedMessage } from "react-intl";

import { SharedInventoryContainer } from "./Container";

import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readAccountInventory } from "../../../features/store/api/read-account-inventory";

// Todo loading state styles are broken
export function SharedInventory() {
  const readAccountInventoryResult = readAccountInventory.useQuery({});
  const authenticationError =
    readAccountInventoryResult.error &&
    "status" in readAccountInventoryResult.error &&
    readAccountInventoryResult.error.status === 401;

  return (
    <Query result={readAccountInventoryResult}>
      <QueryUninitialized>
        <section>
          <div className={classNames(accordionClasses["tab"])}>
            <h3
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              <FormattedMessage defaultMessage="Shared Inventory" />
            </h3>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO is waiting to load your shared inventory" />
            </p>
          </div>
        </section>
      </QueryUninitialized>
      <QueryLoading>
        <SharedInventoryContainer slots={[null, null]} />
      </QueryLoading>
      <QueryError>
        <section>
          <div className={classNames(accordionClasses["tab"])}>
            <h3
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              <FormattedMessage defaultMessage="Shared Inventory" />
            </h3>
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              {authenticationError ? (
                <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
              ) : (
                <FormattedMessage defaultMessage="GWAPO encountered an error loading your shared inventory." />
              )}
            </p>
          </div>
        </section>
      </QueryError>
      <QuerySuccess>
        <SharedInventoryContainer
          slots={readAccountInventoryResult.data ?? []}
        />
      </QuerySuccess>
    </Query>
  );
}
