import { setAccess } from "../actions";
import { api } from "../api";
import { listenerMiddleware } from "../listener-middleware";

import { AccessToken } from "../../types/token";

const gw2SchemaVersion = "2019-05-22T00:00:00.000Z";

interface ReadTokenInfoArguments {
  access_token: string;
}

type ReadTokenInfoResult = AccessToken;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readTokenInfo: build.mutation<
        ReadTokenInfoResult,
        ReadTokenInfoArguments
      >({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
        },
        query({ access_token }) {
          return {
            params: { access_token, v: gw2SchemaVersion },
            url: "/v2/tokeninfo",
            validateStatus(response, body) {
              return (
                response.status === 200 && access_token.startsWith(body.id)
              );
            },
          };
        },
        invalidatesTags(result, error, queryArguments) {
          return [{ type: "access_token" as const, id: "LIST" }].concat(
            (result?.permissions ?? []).map((permission) => ({
              type: "access_token" as const,
              id: permission,
            }))
          );
        },
      }),
    };
  },
});

export const readTokenInfo = injectedApi.endpoints.readTokenInfo;

listenerMiddleware.startListening({
  effect(action, listenerApi) {
    listenerApi.dispatch(
      setAccess({
        ...action.payload,
        id: action.meta.arg.originalArgs.access_token,
      })
    );
  },
  matcher: readTokenInfo.matchFulfilled,
});
