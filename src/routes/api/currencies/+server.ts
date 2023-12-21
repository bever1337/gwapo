import { pool } from "$lib/server/pool";
import { currenciesEntityAdapter } from "$lib/store/api/read-currencies";
import type { Currency, CurrencyCategory } from "$lib/store/api/read-currencies";

import { paramToString } from "../../vault/dyes/common";

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
const preparedCurrenciesQuery = ({
  langTag,
}: {
  /** Relates named_currency */
  langTag: string;
}) => ({
  name: "readCurrencies",
  text: `SELECT * FROM gwapese.select_currencies($1);`,
  values: [langTag],
});

export function GET({ url }) {
  return pool.connect().then((client) =>
    client
      .query<GwapotCurrency>(
        preparedCurrenciesQuery({
          langTag: paramToString(url.searchParams.get("langTag"))!,
        })
      )
      .then((queryResult) => {
        return new Response(
          JSON.stringify(
            currenciesEntityAdapter.setAll(
              currenciesEntityAdapter.getInitialState(),
              queryResult.rows.map(gwapotToGwapo)
            )
          )
        );
      })
      .finally(() => {
        client.release();
      })
  );
}
