import { api } from ".";
import { selectGw2Url } from "./selectors";

import type { AccessToken } from "../../types/token";

export interface ReadTokenInfoArguments {
  access_token: string;
}

export type ReadTokenInfoResult = AccessToken;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readTokenInfo: build.query<ReadTokenInfoResult, ReadTokenInfoArguments>({
        extraOptions: {
          baseUrl: selectGw2Url,
        },
        providesTags(result, error, queryArguments, meta) {
          const tags = [{ type: "access_token" as const, id: "LIST" }];
          if (meta?.access_token) {
            tags.push({ type: "access_token", id: meta.access_token });
          }
          return tags;
        },
        query({ access_token }) {
          return {
            params: { access_token, v: "2019-05-22T00:00:00.000Z" },
            url: "/v2/tokeninfo",
            validateStatus(response, body) {
              return response.status === 200 && access_token.startsWith(body.id);
            },
          };
        },
      }),
    };
  },
});

export const readTokenInfo = injectedApi.endpoints.readTokenInfo;
