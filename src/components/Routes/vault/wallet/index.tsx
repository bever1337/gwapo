import { Fragment } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

import vaultOutletClasses from "../outlet.module.css";

import currencyClasses from "../../../Currency/index.module.css";
import elementsClasses from "../../../Elements/index.module.css";
import { Query } from "../../../Query";
import { QueryError } from "../../../Query/Error";
import { QueryLoading } from "../../../Query/Loading";
import { QuerySuccess } from "../../../Query/Success";
import { QueryUninitialized } from "../../../Query/Uninitialized";

import { classNames } from "../../../../features/css/classnames";
import { readAccountWallet } from "../../../../features/store/api/read-account-wallet";
import {
  initialState,
  readCurrencies,
} from "../../../../features/store/api/read-currencies";

export function VaultWallet() {
  const readCurrenciesResult = readCurrencies.useQuery({});
  const readAccountWalletResult = readAccountWallet.useQuery({});
  return (
    <Fragment>
      <h2
        className={classNames(
          elementsClasses["no-margin"],
          vaultOutletClasses["heading--2"]
        )}
      >
        <FormattedMessage defaultMessage="Wallet" />
      </h2>
      <main className={classNames(vaultOutletClasses["main"])}>
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
                  columns: "8 22rem",
                  maxWidth: "200rem",
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
      </main>
    </Fragment>
  );
}
