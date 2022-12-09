import type { BaseQueryApi } from "@reduxjs/toolkit/src/query/baseQueryTypes";
import { api } from "../api";
import { PouchDB } from "../../features/pouch";
import { TransformBatches } from "../../features/streams/batch";
import { TransformNdj } from "../../features/streams/ndj";

export interface LoadDatabaseArguments {}

export type LoadDatabaseResult = null;

interface DumpHeader {
  version: string;
  db_type: string;
  start_time: string;
  db_info: {
    doc_count: number;
    update_seq: number;
    backend_adapter: string;
    db_name: string;
    auto_compaction: boolean;
    adapter: string;
  };
}

interface DumpSequence {
  seq: number;
}

interface DumpDocs {
  docs: { _id: string; _rev: string; [key: string]: any }[];
}

type DumpNdj = DumpHeader | DumpSequence | DumpDocs;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      loadDatabase: build.mutation<LoadDatabaseResult, LoadDatabaseArguments>({
        invalidatesTags() {
          return [{ type: "internal/pouches", id: "LIST" }];
        },
        queryFn,
      }),
    };
  },
});

export const loadDatabase = injectedApi.endpoints.loadDatabase;

function queryFn(
  queryArguments: LoadDatabaseArguments,
  queryApi: BaseQueryApi
) {
  return fetch(`${process.env.PUBLIC_URL}/dump.txt`)
    .then((response) => {
      if (!response.body) {
        return Promise.reject(new Error("Invalid response"));
      }

      const pouches = new PouchDB("gwapo-db", {
        adapter: "indexeddb",
      });

      let pouch: PouchDB.Database | undefined;
      let dumpMeta: DumpHeader & {
        _id: string;
        $id: string;
        // seq: number;
      };
      const createPouchTransformer = {
        transform(dump, controller) {
          if ("version" in dump) {
            dumpMeta = {
              ...dump,
              _id: `dump_${dump.start_time}`,
              $id: "dump",
              // seq: 0,
            };
            pouch = new PouchDB(dumpMeta._id!, {
              adapter: "indexeddb",
            });
          } else if ("docs" in dump) {
            controller.enqueue(dump.docs);
          }
        },
      } as Transformer<DumpNdj, DumpDocs["docs"]>;

      const sinkToPouchWriter = new WritableStream({
        write(dump, controller) {
          if (!pouch) {
            controller.error("No database headers");
            return Promise.resolve();
          }
          return pouch
            .bulkDocs(dump, {
              new_edits: false,
            })
            .then((bulkDocsResponses) => {
              return Promise.resolve();
            })
            .catch((reason) => {
              return Promise.resolve();
            });
        },
      } as UnderlyingSink<DumpDocs["docs"]>);
      queryApi.signal.addEventListener("abort", () => {
        sinkToPouchWriter.abort();
      });

      return response.body
        .pipeThrough(new TransformStream(new TransformNdj()))
        .pipeThrough(new TransformStream(createPouchTransformer))
        .pipeThrough(new TransformStream(new TransformBatches()))
        .pipeTo(sinkToPouchWriter)
        .then(() => {
          return pouches.put(dumpMeta);
        });
    })
    .then(() => ({ data: null, error: undefined }))
    .catch((reason) => ({ data: undefined, error: reason.toString() }));
}
