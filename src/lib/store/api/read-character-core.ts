import { api } from ".";
import { makeSelectIsInScope } from "./selectors";

import { Scope } from "../../types/token";

export interface ReadCharacterCoreArguments {
  characterName: string;
}

export interface ReadCharacterCoreResult {
  name: string;
  race: "Asura" | "Charr" | "Human" | "Norn" | "Sylvari";
  gender: "Female" | "Male";
  profession:
    | "Elementalist"
    | "Engineer"
    | "Guardian"
    | "Mesmer"
    | "Necromancer"
    | "Ranger"
    | "Revenant"
    | "Thief"
    | "Warrior";
  level: number;
  guild?: string;
  age: number;
  last_modified: string;
  created: string;
  deaths: number;
  title?: string;
}

const scopes = [Scope.Account, Scope.Characters];

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readCharactersCore: build.query<ReadCharacterCoreResult, ReadCharacterCoreArguments>({
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
          if (result && !error) {
            tags.push({ type: "characters", id: result.name });
          }
          return tags;
        },
        query(queryArguments) {
          return {
            url: `/v2/characters/${encodeURI(queryArguments.characterName)}/core`,
            validateStatus(response, body) {
              return response.status === 200 && body.name === queryArguments.characterName;
            },
          };
        },
      }),
    };
  },
});

export const readCharactersCore = injectedApi.endpoints.readCharactersCore;
export const selectReadCharactersInScope = makeSelectIsInScope(scopes);
