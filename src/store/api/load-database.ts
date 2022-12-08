import { api } from "../api";

import { pouch } from "../../features/pouch";

export interface LoadDatabaseArguments {}

export type LoadDatabaseResult = null;

export const injectedApi = api.injectEndpoints({
  endpoints(build) {
    return {
      loadDatabase: build.mutation<LoadDatabaseResult, LoadDatabaseArguments>({
        queryFn(queryArguments, queryApi) {
          return fetch(`${process.env.PUBLIC_URL}/dump.txt`)
            .then((response) => {
              if (!response.body) {
                return Promise.reject(new Error("Invalid response"));
              }
              const writeToPouchStream = new WritableStream({
                write(dump: any[], controller) {
                  const reduced = dump.reduce(
                    (accLines, line) =>
                      !!line.docs ? accLines.concat(line.docs) : accLines,
                    []
                  );

                  return pouch
                    .bulkDocs(reduced, {
                      new_edits: false,
                    })
                    .then((bulkDocsResponses) => {
                      return Promise.resolve();
                    })
                    .catch((reason) => {
                      return Promise.reject();
                    });
                },
              });
              queryApi.signal.addEventListener("abort", () => {
                writeToPouchStream.abort();
              });

              return response.body
                .pipeThrough(new TransformStream(new TransformJsonNewlines()))
                .pipeThrough(new TransformStream(new TransformBatches()))
                .pipeTo(writeToPouchStream);
            })

            .then(() => ({ data: null, error: undefined }))
            .catch((reason) => ({ data: undefined, error: reason.toString() }));
        },
      }),
    };
  },
});

export const loadDatabase = injectedApi.endpoints.loadDatabase;

class TransformJsonNewlines {
  buffer: string = "";
  decoder: TextDecoder = new TextDecoder();

  transform(
    chunkBytes: Uint8Array,
    controller: TransformStreamDefaultController
  ) {
    (
      this.buffer +
      this.decoder.decode(chunkBytes).replace(/\r\n/g, "\n").replace(/\r/, "")
    )
      .split("\n")
      .forEach((line, index, collection) => {
        try {
          const parsed = JSON.parse(line);
          controller.enqueue(parsed);
        } catch (parserError) {
          if (index + 1 === collection.length) {
            // last string from split MAY be non-terminated line
            this.buffer = line;
          }
        }
      });
  }
}

class TransformBatches {
  batchSize: number = 420;
  batch: any[] = [];

  flush(controller: TransformStreamDefaultController) {
    if (this.batch.length > 0) {
      controller.enqueue(this.batch);
      this.batch = [];
    }
  }

  transform(chunk: any, controller: TransformStreamDefaultController) {
    this.batch.push(chunk);
    if (this.batch.length >= this.batchSize) {
      controller.enqueue(this.batch);
      this.batch = [];
    }
  }
}
