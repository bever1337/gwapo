import type { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";

import { QueryContext } from "./context";

export function Query(props: {
  children: any;
  result: UseQueryHookResult<any, any>;
}) {
  return (
    <QueryContext.Provider value={props.result}>
      {props.children}
    </QueryContext.Provider>
  );
}
