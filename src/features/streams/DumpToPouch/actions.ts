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
  private sequenceState!: number;

  constructor(options?: { batchSize?: number }) {
    this.batchSize = options?.batchSize ?? 100;
    this.batch = [];
  }

  buffer(docs: DumpDocs["docs"]) {
    this.batch.push(...docs);
    return Promise.resolve();
  }

  error(reason: string) {
    throw new Error(reason);
  }

  flush() {
    const sequence = this.sequenceState;
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
    const dumpDatabaseName = `${header.db_info.db_name}/${header.start_time}`;
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
          this.sequenceState = finalHeaderDocument.seq;
          Promise.resolve();
        });
      });
  }

  sequence(nextSequence: number): Promise<void> {
    // 1. If input sequence is less than the stateful sequence, bail out and return early
    if (nextSequence < this.sequenceState) {
      // Stream is behind checkpoint, ignore sequence
      this.batch = [];
      return Promise.resolve();
    }
    // 2. Update stateful sequence
    this.sequenceState = nextSequence;
    // 3. If stateful batch length is less than batch size, bail out and return early
    const skipFlush = this.batch.length < this.batchSize;
    if (skipFlush) {
      return Promise.resolve();
    }
    // 4. Clone internal batch
    const previousBatch = [...this.batch];
    // 5. Empty internal batch
    this.batch = [];
    // 6. Put cloned batch to database
    return this.pouch!.bulkDocs(previousBatch, { new_edits: false })
      .then((pouchDbResponse) => {
        if (pouchDbResponse.length > 0) {
          return Promise.reject("Error putting flushed docs");
        }
        return this.pouch!.get(this.pouch!.name);
      })
      .then((headerDocument) => {
        // 7. Put checkpoint change to database
        return this.pouch!.put({ ...headerDocument, seq: nextSequence });
      })
      .then((pouchDbResponse) => {
        if (!pouchDbResponse.ok) {
          return Promise.reject(pouchDbResponse);
        }
        return Promise.resolve();
      });
  }
}
