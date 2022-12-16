import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AccordionControl } from "../Accordion/Control";
import accordionClasses from "../Accordion/index.module.css";
import elementsClasses from "../Elements/index.module.css";
import hideClasses from "../HideA11y/index.module.css";
import materialsClasses from "../materials.module.css";
import { Query } from "../Query";
import { QueryError } from "../Query/Error";
import { QueryLoading } from "../Query/Loading";
import { QuerySuccess } from "../Query/Success";
import { QueryUninitialized } from "../Query/Uninitialized";
import { VaultItem } from "../vault-item";

import { classNames } from "../../features/css/classnames";
import { readAccountInventory } from "../../features/store/api/read-account-inventory";
import { readItems } from "../../features/store/api/read-items";

export function SharedInventory() {
  const readAccountInventoryResult = readAccountInventory.useQuery({});
  const readItemsQueryArguments = {
    ids: (readAccountInventoryResult.data ?? []).reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  };
  const skipReadItemsQuery = readItemsQueryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skipReadItemsQuery ? skipToken : readItemsQueryArguments,
    { skip: skipReadItemsQuery }
  );
  const [open, setOpen] = useState(true);
  const accordionDisabled = readAccountInventoryResult.isError;
  const authenticationError =
    readAccountInventoryResult.error &&
    "status" in readAccountInventoryResult.error &&
    readAccountInventoryResult.error.status === 401;

  return (
    <Query result={readAccountInventoryResult}>
      <section
        className={classNames(materialsClasses["materials__inline-wrapper"])}
      >
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
          <QueryError>
            <p className={classNames(elementsClasses["no-margin"])}>
              {authenticationError ? (
                <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
              ) : (
                <FormattedMessage defaultMessage="GWAPO encountered an error loading your shared inventory." />
              )}
            </p>
          </QueryError>
          <QueryLoading>
            <ol
              className={classNames(
                materialsClasses["materials__list"],
                elementsClasses["no-margin"]
              )}
            >
              <VaultItem accountBankItem={null} />
              <VaultItem accountBankItem={null} />
            </ol>
          </QueryLoading>
          <QuerySuccess>
            <ol
              className={classNames(
                materialsClasses["materials__list"],
                elementsClasses["no-margin"]
              )}
            >
              {(readAccountInventoryResult.data ?? []).map(
                (sharedInventoryItem, index) => (
                  // Warning: shared inventory slots do not have any unique identifiers
                  // Features like filtering and sorting will not work until each item has a uid
                  // For now, we can assume this is safe because the list is static
                  <VaultItem
                    accountBankItem={sharedInventoryItem}
                    item={
                      readItemsResult.data?.entities?.[
                        sharedInventoryItem?.id ?? ""
                      ]
                    }
                    key={index}
                  />
                )
              )}
            </ol>
          </QuerySuccess>
        </div>
      </section>
    </Query>
  );
}
