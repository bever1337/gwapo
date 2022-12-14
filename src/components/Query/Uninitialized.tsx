import type { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useContext } from "react";

import { QueryContext } from "./context";

export function QueryUninitialized(props: { children: any }) {
  const result = useContext(QueryContext) as UseQueryHookResult<any>;
  if (result.isUninitialized) {
    return props.children;
  }
  return null;
}
