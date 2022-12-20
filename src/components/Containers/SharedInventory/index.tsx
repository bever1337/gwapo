import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { SharedInventoryContainer } from "./Container";

import { AccordionControl } from "../../Accordion/Control";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../HideA11y/index.module.css";
import materialsClasses from "../../materials.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";

import { classNames } from "../../../features/css/classnames";
import { readAccountInventory } from "../../../features/store/api/read-account-inventory";

export function SharedInventory() {
  const readAccountInventoryResult = readAccountInventory.useQuery({});
  const [open, setOpen] = useState(true);
  const accordionDisabled = readAccountInventoryResult.isError;
  const authenticationError =
    readAccountInventoryResult.error &&
    "status" in readAccountInventoryResult.error &&
    readAccountInventoryResult.error.status === 401;

  return (
    <Query result={readAccountInventoryResult}>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <h2
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            <FormattedMessage defaultMessage="Shared Inventory" />
          </h2>
          {accordionDisabled ? null : (
            <AccordionControl onChange={setOpen} open={open} />
          )}
        </div>
        <div
          className={classNames(
            accordionDisabled === false &&
              open === false &&
              hideClasses["hide"],
            accordionClasses["folder"]
          )}
        >
          <QueryUninitialized>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO is waiting to load your shared inventory" />
            </p>
          </QueryUninitialized>
          <QueryLoading>
            <ol
              className={classNames(
                materialsClasses["materials__list"],
                elementsClasses["no-margin"]
              )}
            >
              <SharedInventoryContainer slots={[null, null]} />
            </ol>
          </QueryLoading>
          <QueryError>
            <p className={classNames(elementsClasses["no-margin"])}>
              {authenticationError ? (
                <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
              ) : (
                <FormattedMessage defaultMessage="GWAPO encountered an error loading your shared inventory." />
              )}
            </p>
          </QueryError>
          <QuerySuccess>
            <SharedInventoryContainer
              slots={readAccountInventoryResult.data ?? []}
            />
          </QuerySuccess>
        </div>
      </section>
    </Query>
  );
}
