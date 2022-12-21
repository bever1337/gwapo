import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import containerClasses from "../Common/Container.module.css";
import { ContainerItem } from "../Common/ContainerItem";

import { AccordionControl } from "../../Accordion/Control";
import accordionClasses from "../../Accordion/index.module.css";
import elementsClasses from "../../Elements/index.module.css";
import hideClasses from "../../Elements/Hide.module.css";
import { Query } from "../../Query";

import { classNames } from "../../../features/css/classnames";
import type { AccountBankItem } from "../../../features/store/api/read-account-bank";
import { readItems } from "../../../features/store/api/read-items";

export function BankContainer(props: {
  accountBankItems: (AccountBankItem | null)[];
  bankTab: number;
}) {
  const [open, setOpen] = useState(true);
  const queryArguments = {
    ids: props.accountBankItems.reduce(
      (acc, item) => (item ? acc.concat([item.id]) : acc),
      [] as number[]
    ),
  };
  const skip = queryArguments.ids.length === 0;
  const readItemsResult = readItems.useQuery(
    skip ? skipToken : queryArguments,
    { skip }
  );
  return (
    <Fragment>
      <section>
        <div className={classNames(accordionClasses["tab"])}>
          <h3
            className={classNames(
              accordionClasses["tab__heading"],
              elementsClasses["no-margin"]
            )}
          >
            <FormattedMessage
              defaultMessage="Bank Tab {bankTab}"
              values={{
                bankTab: props.bankTab + 1,
              }}
            />
          </h3>
          <AccordionControl onChange={setOpen} open={open} />
        </div>
        <div
          className={classNames(
            accordionClasses["folder"],
            !open && hideClasses["hide"]
          )}
        >
          <ol
            className={classNames(
              containerClasses["container"],
              elementsClasses["no-margin"]
            )}
          >
            <Query result={readItemsResult}>
              {props.accountBankItems.map((accountBankTabItem, index) => (
                // Warning: account bank slots do not have any unique identifiers
                // Features like filtering and sorting will not work until each item has a uid
                // For now, we can assume this is safe because the list is static
                <ContainerItem
                  containerItem={accountBankTabItem}
                  item={
                    readItemsResult.data?.entities?.[
                      accountBankTabItem?.id ?? ""
                    ]
                  }
                  key={index}
                />
              ))}
            </Query>
          </ol>
        </div>
      </section>
    </Fragment>
  );
}
