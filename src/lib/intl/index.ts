import { createIntl, createIntlCache } from "@formatjs/intl";

const cache = createIntlCache();

export const intl = createIntl(
  {
    locale: "en-US",
    messages: {},
  },
  cache
);
