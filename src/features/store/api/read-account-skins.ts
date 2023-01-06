import { api } from ".";

import { Scope } from "../../../types/token";

interface ReadAccountSkinsArguments {}

type ReadAccountSkinsResult = number[];

const scopes = [Scope.Account, Scope.Unlocks];
const scopeTags = scopes
  .map((scope) => ({
    type: "access_token" as const,
    id: scope as any,
  }))
  .concat([{ type: "access_token" as const, id: "LIST" }]);

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccountSkins: build.query<
        ReadAccountSkinsResult,
        ReadAccountSkinsArguments
      >({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags(result, error, queryArguments) {
          return scopeTags;
        },
        query() {
          return {
            url: "/v2/account/skins",
            validateStatus(response, body) {
              const okResponse = response.status === 200;
              const expectedBodyType = Array.isArray(body);
              const expectedValueType =
                body.length === 0 || typeof body[0] === "number";
              return okResponse && expectedBodyType && expectedValueType;
            },
          };
        },
      }),
    };
  },
});

export const readAccountSkins = injectedApi.endpoints.readAccountSkins;
