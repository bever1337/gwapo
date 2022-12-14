import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { AccordionHeading } from "../../../Accordion/Heading";
import accordionClasses from "../../../Accordion/index.module.css";
import { BankContainer } from "../../../Containers/Bank/Container";
import elementsClasses from "../../../Elements/index.module.css";
import { Query } from "../../../Query";
import { QueryError } from "../../../Query/Error";
import { QueryLoading } from "../../../Query/Loading";
import { QuerySuccess } from "../../../Query/Success";
import { QueryUninitialized } from "../../../Query/Uninitialized";
import { classNames } from "../../../../features/css/classnames";
import {
  ITEMS_PER_TAB,
  readAccountBank,
  selectAccountBankWithTabs,
} from "../../../../features/store/api/read-account-bank";
import type { AccountBankItem } from "../../../../features/store/api/read-account-bank";

const mapAccountBankTabToElement = (
  accountBankTab: (AccountBankItem | null)[],
  accountBankTabIndex: number
) => (
  // TODO
  // Warning: Does not support re-ordering! Using index as key!
  <BankContainer
    accountBankItems={accountBankTab}
    bankTab={accountBankTabIndex}
    key={accountBankTabIndex}
  />
);

const skeletonVaultContainer = mapAccountBankTabToElement(
  new Array(ITEMS_PER_TAB).fill(null),
  0
);

export function VaultBank() {
  const readAccountBankResult = readAccountBank.useQuery({});
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  const authenticationError =
    readAccountBankResult.error &&
    "status" in readAccountBankResult.error &&
    readAccountBankResult.error.status === 401;

  return (
    <Query result={readAccountBankResult}>
      <QueryUninitialized>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>
            <FormattedMessage defaultMessage="Bank Tab" />
          </AccordionHeading>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <p className={classNames(elementsClasses["no-margin"])}>
            <FormattedMessage defaultMessage="GWAPO is waiting to load your account's vault" />
          </p>
        </div>
      </QueryUninitialized>
      <QueryLoading>{skeletonVaultContainer}</QueryLoading>
      <QueryError>
        <div className={classNames(accordionClasses["tab"])}>
          <AccordionHeading>
            <FormattedMessage defaultMessage="Bank Tab" />
          </AccordionHeading>
        </div>
        <div className={classNames(accordionClasses["folder"])}>
          <p className={classNames(elementsClasses["no-margin"])}>
            {authenticationError ? (
              <FormattedMessage defaultMessage="Please provide GWAPO an API token with the necessary scopes." />
            ) : (
              <FormattedMessage defaultMessage="GWAPO encountered an error loading your account's vault." />
            )}
          </p>
        </div>
      </QueryError>
      <QuerySuccess>
        {accountBankTabs.map(mapAccountBankTabToElement)}
      </QuerySuccess>
    </Query>
  );
}
