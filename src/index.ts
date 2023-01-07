import { createElement, StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  createElement(StrictMode, undefined, createElement(App))
);
