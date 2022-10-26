import type { Middleware } from "@reduxjs/toolkit";
import * as PouchDB from "pouchdb";

import type { AppDispatch, RootState } from ".";

export const pouchMiddleware: Middleware<{}, RootState> =
  function pouchMiddleware({ dispatch, getState }) {
    return function (next) {
      return function (action) {
        return next(action);
      };
    };
  };
