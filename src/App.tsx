import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";

import { RoutesProvider } from "./components/Routes/_provider";
import { store } from "./features/store";

const appStore = store();

export function App() {
  return (
    <Provider store={appStore}>
      <IntlProvider defaultLocale="en-US" locale="en-US">
        <RoutesProvider />
      </IntlProvider>
    </Provider>
  );
}
