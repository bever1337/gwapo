import type { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useContext } from "react";

import { QueryContext } from "./context";

export function QuerySuccess(props: { children: any }) {
  const result = useContext(QueryContext) as UseQueryHookResult<any>;
  if (result.isSuccess) {
    return props.children;
  }
  return null;
}
