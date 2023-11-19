import { api } from ".";
import { makeSelectIsInScope } from "./selectors";

import { Scope } from "../../types/token";

const scopes = [Scope.Account, Scope.Characters];

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCharacters: build.query<string[], Record<string, never>>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags(result, error, queryArguments, meta) {
          const tags = [
            { type: "access_token" as const, id: "LIST" },
            { type: "characters" as const, id: "LIST" },
          ];
          if (meta?.access_token) {
            tags.push({ type: "access_token", id: meta.access_token });
          }
          return tags;
        },
        query() {
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
