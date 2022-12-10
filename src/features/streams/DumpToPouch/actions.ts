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

  constructor(options?: { batchSize?: number }) {
    this.batchSize = options?.batchSize ?? 100;
    this.batch = [];
  }

  error(reason: string) {
    throw new Error(reason);
  }

  flush(sequence: number, force = false) {
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
      .then((pouchDbResponse) => Promise.resolve());
  }

  initialize(header: DumpHeader) {
    const dumpMetaDocId = `dump_${header.start_time}`;
    this.pouch = new PouchDB(dumpMetaDocId, {
      adapter: "indexeddb",
    });
    return this.pouch
      .get(dumpMetaDocId)
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
        () =>
          ({
            ...header,
            _id: `dump_${header.start_time}`,
            $id: "dump",
            seq: 0,
          } as DumpHeaderDocument)
      )
      .then((finalHeaderDocument) => {
        return this.pouch!.put(finalHeaderDocument);
      })
      .then((pouchDbResponse) => Promise.resolve());
  }

  async buffer(docs: DumpDocs["docs"]) {
    this.batch.push(...docs);
  }
}
