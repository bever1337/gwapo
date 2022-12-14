import type { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { createContext } from "react";

export const QueryContext = createContext(
  undefined as UseQueryHookResult<any, any>
);
