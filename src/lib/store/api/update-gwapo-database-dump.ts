import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";

import { api } from ".";

import { getPouch, PouchDB } from "../../pouch";

export interface UpdateGwapoDatabaseDumpArguments {}

export type UpdateGwapoDatabaseResult = null;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      updateGwapoDatabaseDump: build.query<null, Record<string, never>>({
        queryFn(queryArguments: UpdateGwapoDatabaseDumpArguments, queryApi: BaseQueryApi) {
          const localDB = getPouch();

          return new Promise<void>((resolve, reject) => {
            const remoteDB = new PouchDB("http://localhost:5984/gwapo");

            const replicationHandler = remoteDB.replicate.to(localDB, {
              // live: true,
              retry: true,
            });

            replicationHandler
              .on("active", () => {
                console.debug("acitve");
              })
              .on("change", () => {
                console.debug("change");
              })
              .on("complete", () => {
                console.debug("complete");
                resolve();
              })
              .on("denied", () => {
                console.debug("denied");
                reject();
              })
              .on("error", () => {
                console.debug("error");
                reject();
              })
              .on("paused", () => {
                console.debug("paused");
              });

            queryApi.signal.addEventListener(
              "abort",
              function () {
                replicationHandler.cancel();
              },
              { once: true }
            );
          }).then(() => ({ data: null }));
        },
      }),
    };
  },
});

export const updateGwapoDatabaseDump = injectedApi.endpoints.updateGwapoDatabaseDump;
