import type {
  DumpHeader,
  DumpHeaderDocument,
  DumpDocs,
  DumpToPouchSinkActions,
} from "./types";

import { PouchDB } from "../../pouch";

export class DumpStreamActions implements DumpToPouchSinkActions {
  private batch: DumpDocs["docs"];
  private batchSize: number;
  private pouch?: PouchDB.Database;
  private sequence!: number;

  constructor(options?: { batchSize?: number }) {
    this.batchSize = options?.batchSize ?? 100;
    this.batch = [];
  }

  error(reason: string) {
    throw new Error(reason);
  }

  flush(sequence: number, force = false) {
    if (force) {
      // When flush is forced, input sequence is 0
      sequence = this.sequence;
    } else if (sequence < this.sequence) {
      // Stream is behind checkpoint
      this.batch = [];
      return Promise.resolve();
    } else {
      // During normal flush, update internal sequence
      this.sequence = sequence;
    }
    const skipFlush = force === false && this.batch.length < this.batchSize;
    if (skipFlush) {
      return Promise.resolve();
    }
    const previousBatch = [...this.batch];
    this.batch = [];
    return this.pouch!.bulkDocs(previousBatch, { new_edits: false })
      .then((pouchDbResponse) => {
        if (pouchDbResponse.length > 0) {
          return Promise.reject("Error putting flushed docs");
        }
        return this.pouch!.get(this.pouch!.name);
      })
      .then((headerDocument) => {
        return this.pouch!.put({ ...headerDocument, seq: sequence });
      })
      .then((pouchDbResponse) => {
        if (!pouchDbResponse.ok) {
          return Promise.reject(pouchDbResponse);
        }
        return Promise.resolve();
      });
  }

  initialize(header: DumpHeader) {
    const dumpDatabaseName = `@gwapo/dump/${header.start_time}`;
    this.pouch = new PouchDB(dumpDatabaseName, {
      adapter: "indexeddb",
    });
    return this.pouch
      .get(dumpDatabaseName)
      .then(
        // document exists, re-write contents for sanity check
        (savedDumpHeaderDocument) => ({
          ...savedDumpHeaderDocument,
          ...header,
          seq: (savedDumpHeaderDocument as any as DumpHeaderDocument)?.seq ?? 0,
        })
      )
      .catch(
        // document may not exist, OR ignore the error
        (reason) =>
          ({
            ...header,
            _id: dumpDatabaseName,
            $id: "dump",
            seq: 0,
          } as DumpHeaderDocument)
      )
      .then((finalHeaderDocument) => {
        return this.pouch!.put(finalHeaderDocument).then((pouchDbResponse) => {
          if (!pouchDbResponse.ok) {
            return Promise.reject(pouchDbResponse);
          }
          this.sequence = finalHeaderDocument.seq;
          console.error("start at", this.sequence);
          Promise.resolve();
        });
      });
  }

  async buffer(docs: DumpDocs["docs"]) {
    this.batch.push(...docs);
  }
}
