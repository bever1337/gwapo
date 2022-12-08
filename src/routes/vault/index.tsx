import { Fragment } from "react";
import { useSelector } from "react-redux";

import { VaultTab } from "../../components/vault-tab";
import {
  readAccountBank,
  selectReadAccountBankInScope,
  selectAccountBankWithTabs,
} from "../../store/api/read-account-bank";

const queryCacheArguments = {};

// Implementing a skeleton state for the bank vault is easy
// All accounts start with 1 tab, all tabs hold 30 items
export function Vault() {
  const skip = !useSelector(selectReadAccountBankInScope);
  readAccountBank.useQuery(queryCacheArguments, { skip });
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  return (
    <Fragment>
      <h1>Account Vault</h1>
      {accountBankTabs.map((accountBankTab, accountBankTabIndex) => (
        // Warning: Does not support re-ordering! Using index as key!
        <VaultTab
          accountBankItems={accountBankTab}
          bankTab={accountBankTabIndex}
          key={accountBankTabIndex}
        />
      ))}
    </Fragment>
  );
}
