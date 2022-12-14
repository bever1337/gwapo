import type { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useContext } from "react";

import { QueryContext } from "./context";

/** Unlike RTKQ, `fetching` state is exclusive with `loading` state */
export function QueryFetching(props: { children: any }) {
  const result = useContext(QueryContext) as UseQueryHookResult<any>;
  if (result.isFetching && !result.isLoading) {
    return props.children;
  }
  return null;
}
