import { pool } from "$lib/server/pool";

import { injectedApi as api, currenciesEntityAdapter } from "./read-currencies";
import type { Currency, CurrencyCategory } from "./read-currencies";

export interface GwapotCurrency {
  id: number;
  categories: CurrencyCategory[];
  currency_description: string;
  currency_name: string;
  deprecated: boolean;
  icon: string;
  presentation_order: number;
}

const gwapotToGwapo = ({
  id,
  categories,
  currency_description,
  currency_name,
  deprecated,
  icon,
  presentation_order,
}: GwapotCurrency): Currency => ({
  id,
  categories,
  deprecated,
  description: currency_description,
  icon,
  name: currency_name,
  order: presentation_order,
});

export const injectedApi = api.enhanceEndpoints({
  endpoints: {
    readCurrencies: {
      queryFn(queryArguments) {
        return pool.connect().then((client) =>
          client
            .query({
              name: "readCurrencies",
              text: `SELECT * FROM gwapese.select_currencies($1);`,
              values: [queryArguments.langTag],
            })
            .then((queryResult) => ({
              data: currenciesEntityAdapter.setAll(
                currenciesEntityAdapter.getInitialState(),
                queryResult.rows.map(gwapotToGwapo)
              ),
              error: undefined,
            }))
            .catch((reason) => ({
              data: undefined,
              error: {
                error: (reason?.toString?.() as string | undefined) ?? `${reason}`,
                status: "CUSTOM_ERROR" as const,
              },
            }))
            .finally(() => {
              client.release();
            })
        );
      },
    },
  },
});

export const readCurrencies = injectedApi.endpoints.readCurrencies;
