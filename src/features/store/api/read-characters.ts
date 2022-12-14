import { api } from ".";
import { makeSelectIsInScope } from "../selectors";

import { Scope } from "../../../types/token";

const scopes = [Scope.Account, Scope.Characters];
const scopeTags = scopes
  .map((scope) => ({
    type: "access_token" as const,
    id: scope as any,
  }))
  .concat([{ type: "access_token" as const, id: "LIST" }]);

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCharacters: build.query<string[], {}>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags() {
          return [{ id: "LIST", type: "characters" }, ...scopeTags];
        },
        query(queryArguments) {
          return {
            url: "/v2/characters",
            validateStatus(response, body) {
              return (
                response.status === 200 &&
                Array.isArray(body) &&
                // no characters in account, OR characters are strings
                (body.length === 0 || typeof body[0] === "string")
              );
            },
          };
        },
      }),
    };
  },
});

export const readCharacters = injectedApi.endpoints.readCharacters;
export const selectReadCharactersInScope = makeSelectIsInScope(scopes);
