/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryStatus } from "@reduxjs/toolkit/query";

import { hydrate } from "../api/slice";
import type { AppDispatch, RootState } from "..";

export const hydrateThunk =
  (preloadedState: RootState["cache"]) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().cache;
    return dispatch(
      hydrate({
        ...preloadedState,
        mutations: {},
        queries: Object.entries(preloadedState.queries).reduce(
          (acc: typeof preloadedState.queries, [key, newEntry]) => {
            const currentEntry = state?.queries?.[key];
            /** do not rehydrate entries that were currently in flight. */
            const newEntryResolved =
              newEntry?.status === QueryStatus.fulfilled ||
              newEntry?.status === QueryStatus.rejected;
            /** do not upsert already fulfilled entries */
            const currentEntryUnresolved = currentEntry?.status !== QueryStatus.fulfilled;
            /** unless they are stale */
            const currentEntryIsOlder =
              (currentEntry?.fulfilledTimeStamp ?? 0) <= (newEntry?.fulfilledTimeStamp ?? 0);

            if (newEntryResolved && (currentEntryUnresolved || currentEntryIsOlder)) {
              acc[key] = newEntry;
            }

            return acc;
          },
          {}
        ),
      })
    );
  };
