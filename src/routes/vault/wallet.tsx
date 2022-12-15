import { FormattedMessage } from "react-intl";

import currencyClasses from "../../components/Currency/index.module.css";
import elementsClasses from "../../components/Elements/index.module.css";
import { Query } from "../../components/Query";
import { QueryError } from "../../components/Query/Error";
import { QueryLoading } from "../../components/Query/Loading";
import { QuerySuccess } from "../../components/Query/Success";
import { QueryUninitialized } from "../../components/Query/Uninitialized";
import { classNames } from "../../features/css/classnames";
import { readAccountWallet } from "../../features/store/api/read-account-wallet";
import {
  initialState,
  readCurrencies,
} from "../../features/store/api/read-currencies";

export function VaultWallet() {
  const { data: currencies = initialState } = readCurrencies.useQuery({});
  const readAccountWalletResult = readAccountWallet.useQuery({});
  return (
    <Query result={readAccountWalletResult}>
      <h2>
        <FormattedMessage defaultMessage="Wallet" />
      </h2>
      <ol
        className={classNames(
          elementsClasses["no-margin"],
          elementsClasses["no-padding"]
        )}
        style={{
          columnGap: "1rem",
          columns: "4 32rem",
        }}
      >
        {currencies.ids.map((currencyId) => (
          <li
            className={classNames(currencyClasses["currency"])}
            key={currencyId}
          >
            <span className={classNames(currencyClasses["currency__name"])}>
              {currencies.entities[currencyId]?.name}
            </span>
            <span className={classNames(currencyClasses["currency__amount"])}>
              <QueryUninitialized>-</QueryUninitialized>
              <QueryLoading>-</QueryLoading>
              <QueryError>x</QueryError>
              <QuerySuccess>
                {readAccountWalletResult.data?.entities[currencyId]?.value ?? 0}
              </QuerySuccess>
            </span>
            <img
              alt={currencies.entities[currencyId]?.name}
              className={classNames(currencyClasses["currency__img"])}
              src={currencies.entities[currencyId]?.icon}
            />
          </li>
        ))}
      </ol>
    </Query>
  );
}
