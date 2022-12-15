import { getDatabaseName } from "./read-gwapo-databases";

import { api } from ".";

import { PouchDB } from "../../pouch";

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      demo: build.query<any, {}>({
        providesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        async queryFn(queryArguments, queryApi) {
          return getDatabaseName(queryApi)
            .then(
              (databaseName) =>
                new PouchDB(databaseName, { adapter: "indexeddb" }).query(
                  "gw2_skins/types",
                  { group: true }
                )
              // .allDocs({
              //   keys: ids.map((itemId) => `items_${itemId}`),
              //   include_docs: true,
              // })
            )
            .then((allDocsResponse) => {
              return {
                data: allDocsResponse,
                error: undefined,
              };
            })
            .catch((reason) => ({ data: undefined, error: reason }));
        },
      }),
    };
  },
});

export const demo = injectedApi.endpoints.demo;
