import { Fragment } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

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
  const readCurrenciesResult = readCurrencies.useQuery({});
  const readAccountWalletResult = readAccountWallet.useQuery({});
  return (
    <Fragment>
      <h2>
        <FormattedMessage defaultMessage="Wallet" />
      </h2>
      <Query result={readCurrenciesResult}>
        <QueryUninitialized>Waiting to load currencies...</QueryUninitialized>
        <QueryLoading>Loading currencies...</QueryLoading>
        <QueryError>Failed to load currencies</QueryError>
        <QuerySuccess>
          <Query result={readAccountWalletResult}>
            <ol
              className={classNames(
                elementsClasses["no-margin"],
                elementsClasses["no-padding"]
              )}
              style={{
                columnGap: "1rem",
                columns: "5 24rem",
              }}
            >
              {(readCurrenciesResult.data ?? initialState).ids.map(
                (currencyId) => (
                  <li
                    className={classNames(currencyClasses["currency"])}
                    key={currencyId}
                  >
                    <h3
                      className={classNames(
                        currencyClasses["currency__name"],
                        elementsClasses["no-margin"]
                      )}
                    >
                      {readCurrenciesResult.data!.entities[currencyId]!.name}
                    </h3>
                    <span
                      className={classNames(
                        currencyClasses["currency__amount"]
                      )}
                    >
                      <QueryUninitialized>-</QueryUninitialized>
                      <QueryLoading>-</QueryLoading>
                      <QueryError>x</QueryError>
                      <QuerySuccess>
                        <FormattedNumber
                          value={
                            readAccountWalletResult.data?.entities[currencyId]
                              ?.value ?? 0
                          }
                          maximumSignificantDigits={3}
                        />
                      </QuerySuccess>
                    </span>
                    <img
                      alt={
                        readCurrenciesResult.data!.entities[currencyId]?.name
                      }
                      className={classNames(currencyClasses["currency__img"])}
                      src={
                        readCurrenciesResult.data!.entities[currencyId]?.icon
                      }
                    />
                    <p
                      className={classNames(
                        currencyClasses["currency__description"],
                        elementsClasses["no-margin"]
                      )}
                    >
                      {
                        readCurrenciesResult.data!.entities[currencyId]!
                          .description
                      }
                    </p>
                  </li>
                )
              )}
            </ol>
          </Query>
        </QuerySuccess>
      </Query>
    </Fragment>
  );
}
