import { api } from ".";

import { Scope } from "../../types/token";

type ReadAccountArguments = Record<string, never>;

export interface Account {
  /** The unique persistent account GUID. */
  id: string;
  /** A list of what content this account has access to. */
  access: string[];
  /** True if the player has bought a commander tag. */
  commander: boolean;
  /** An ISO-8601 standard timestamp of when the account was created. */
  created: string;
  /**  The age of the account in seconds. */
  age: number;
  /** A list of guilds assigned to the given account. */
  guilds: unknown[];
  /** An ISO-8601 standard timestamp of when the account information last changed as perceived by the API.  */
  last_modified: string;
  /** The unique account name with numerical suffix. It is possible that the name change. Do not rely on the name, use id instead. */
  name: string;
  /** The id of the home world the account is assigned to. Can be resolved against /v2/worlds. */
  world: number;
}

export type ReadAccountResult = Account;

const scopes = [Scope.Account];

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      readAccount: build.query<ReadAccountResult, ReadAccountArguments>({
        extraOptions: {
          baseUrl: "https://api.guildwars2.com",
          scope: scopes,
        },
        providesTags(result, error, queryArguments, meta) {
          const tags = [{ type: "access_token" as const, id: "LIST" }];
          if (meta?.access_token) {
            tags.push({ type: "access_token", id: meta.access_token });
          }
          return tags;
        },
        query() {
          return {
            params: {
              v: `2019-12-19T00:00:00.000Z `,
            },
            url: "/v2/account",
            validateStatus(response, body) {
              return (
                response.status === 200 &&
                body !== null &&
                typeof body === "object" &&
                typeof body.id === "string" &&
                body.id.length > 0
              );
            },
          };
        },
      }),
    };
  },
});

export const readAccount = injectedApi.endpoints.readAccount;
