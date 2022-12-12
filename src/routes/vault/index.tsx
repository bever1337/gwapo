import { Fragment } from "react";
import { useSelector } from "react-redux";

import { VaultTab } from "../../components/vault-tab";
import {
  readAccountBank,
  selectReadAccountBankInScope,
  selectAccountBankWithTabs,
} from "../../features/store/api/read-account-bank";

const skeletonBankTab = (
  <VaultTab accountBankItems={new Array(30).fill(null)} bankTab={0} />
);

export function Vault() {
  const skip = !useSelector(selectReadAccountBankInScope);
  readAccountBank.useQuery({}, { skip });
  const accountBankTabs = useSelector(selectAccountBankWithTabs);
  return (
    <Fragment>
      <h1>Account Vault</h1>
      {accountBankTabs.length
        ? accountBankTabs.map((accountBankTab, accountBankTabIndex) => (
            // TODO
            // Warning: Does not support re-ordering! Using index as key!
            <VaultTab
              accountBankItems={accountBankTab}
              bankTab={accountBankTabIndex}
              key={accountBankTabIndex}
            />
          ))
        : skeletonBankTab}
    </Fragment>
  );
}
