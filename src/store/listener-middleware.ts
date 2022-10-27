// import type { Middleware } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";
// import * as PouchDB from "pouchdb";

import type { AppDispatch, RootState } from ".";

export const listenerMiddleware = createListenerMiddleware();
