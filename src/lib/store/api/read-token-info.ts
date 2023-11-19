import { api } from ".";

import type { AccessToken } from "../../types/token";

export interface ReadTokenInfoArguments {
  access_token: string;
}

export type ReadTokenInfoResult = AccessToken;

export const readTokenInfo = api.endpoints.readTokenInfo;
