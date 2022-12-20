import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { AccordionControl } from "../../Accordion/Control";
import accordionClasses from "../../Accordion/index.module.css";
import { BankContainer } from "../../Containers/Bank/Container";
import elementsClasses from "../../Elements/index.module.css";
import materialsClasses from "../../materials.module.css";
import { Query } from "../../Query";
import { QueryError } from "../../Query/Error";
import { QueryLoading } from "../../Query/Loading";
import { QuerySuccess } from "../../Query/Success";
import { QueryUninitialized } from "../../Query/Uninitialized";
import { classNames } from "../../../features/css/classnames";
import {
  ITEMS_PER_TAB,
  readAccountBank,
  selectAccountBankWithTabs,
} from "../../../features/store/api/read-account-bank";
import type { AccountBankItem } from "../../../features/store/api/read-account-bank";

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

export function Bank() {
  const readAccountBankResult = readAccountBank.useQuery({});
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  const authenticationError =
    readAccountBankResult.error &&
    "status" in readAccountBankResult.error &&
    readAccountBankResult.error.status === 401;

  return (
    <Query result={readAccountBankResult}>
      <QueryUninitialized>
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
              {/* Bank tabs have no heading in GW2. Mirror that choice here */}
              {""}
            </h2>
            <AccordionControl onChange={() => {}} open={true} />
          </div>
          <div className={classNames(accordionClasses["folder"])}>
            <p className={classNames(elementsClasses["no-margin"])}>
              <FormattedMessage defaultMessage="GWAPO is waiting to load your account's vault" />
            </p>
          </div>
        </section>
      </QueryUninitialized>
      <QueryLoading>{skeletonVaultContainer}</QueryLoading>
      <QueryError>
        <section
          className={classNames(materialsClasses["materials__inline-wrapper"])}
        >
          <div className={classNames(accordionClasses["tab"])}>
            <h3
              className={classNames(
                accordionClasses["tab__heading"],
                elementsClasses["no-margin"]
              )}
            >
              {/* Bank tabs have no heading in GW2. Mirror that choice here */}
              {""}
            </h3>
            <AccordionControl onChange={() => {}} open={true} />
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
        </section>
      </QueryError>
      <QuerySuccess>
        {accountBankTabs.map(mapAccountBankTabToElement)}
      </QuerySuccess>
    </Query>
  );
}
