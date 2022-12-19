import type {
  DumpHeader,
  DumpHeaderDocument,
  DumpDocs,
  DumpToPouchSinkActions,
} from "./types";

import { PouchDB } from "../../pouch";

/** Internal state of a DumpStreamActions instance */
interface DumpStreamContext {
  /** Current dump progress */
  seq: number;
  db_info: {
    /** Name used to derive dump database name, meta database name, and dump doc id */
    db_name: string;
  };
  /** Timestamp when dump file was created */
  start_time: string;
}

/** Name of dump database AND id of dump checkpoint document in meta database */
export const toDumpDatabaseName = (header: Omit<DumpStreamContext, "seq">) =>
  `${header.db_info.db_name}/${header.start_time}`;
/** Name of meta database that holds dump checkpoint documents */
export const toMetaDatabaseName = (header: Omit<DumpStreamContext, "seq">) =>
  header.db_info.db_name;

export class DumpStreamActions implements DumpToPouchSinkActions {
  /** Internal buffering of documents */
  private batch: DumpDocs["docs"];
  /** Minimum buffer length before changes are pushed to pouch */
  private batchSize: number;
  /** Database target for dump documents */
  private dumpPouch?: PouchDB.Database;
  /** Database meta info for checkpointing, deriving database names */
  private header?: DumpStreamContext;
  /** Database target for dump progress */
  private metaPouch?: PouchDB.Database;

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
    const sequence = this.header!.seq;
    const previousBatch = [...this.batch];
    this.batch = [];
    return this.dumpPouch!.bulkDocs(previousBatch, { new_edits: false })
      .then((pouchDbResponse) => {
        if (pouchDbResponse.length > 0) {
          return Promise.reject("Error putting flushed docs");
        }
        return this.metaPouch!.get(toDumpDatabaseName(this.header!));
      })
      .then((headerDocument) => {
        return this.metaPouch!.put({ ...headerDocument, seq: sequence });
      })
      .then((pouchDbResponse) => {
        if (!pouchDbResponse.ok) {
          return Promise.reject(pouchDbResponse);
        }
        return Promise.resolve();
      });
  }

  initialize(header: DumpHeader) {
    this.dumpPouch = new PouchDB(toDumpDatabaseName(header), {
      adapter: "indexeddb",
    });
    this.metaPouch = new PouchDB(toMetaDatabaseName(header), {
      adapter: "indexeddb",
    });
    return this.metaPouch
      .get(toDumpDatabaseName(header))
      .then(
        // document exists, re-write contents for sanity check
        (savedDumpHeaderDocument) =>
          ({
            ...savedDumpHeaderDocument,
            ...header,
            seq:
              (savedDumpHeaderDocument as any as DumpHeaderDocument)?.seq ?? 0,
          } as any as DumpHeaderDocument)
      )
      .catch(
        // document may not exist, OR ignore the error
        (reason) =>
          ({
            ...header,
            _id: toDumpDatabaseName(header),
            $id: "dump",
            seq: 0,
          } as DumpHeaderDocument)
      )
      .then((finalHeaderDocument) => {
        return this.metaPouch!.put(finalHeaderDocument).then(
          (pouchDbResponse) => {
            if (!pouchDbResponse.ok) {
              return Promise.reject(pouchDbResponse);
            }
            // If initialize was successful, store header for checkpointing
            this.header = finalHeaderDocument;
            Promise.resolve();
          }
        );
      });
  }

  sequence(nextSequence: number): Promise<void> {
    // 1. If input sequence is less than the stateful sequence, bail out and return early
    if (nextSequence < this.header!.seq) {
      // Stream is behind checkpoint, update checkpoint
      this.batch = [];
      return Promise.resolve();
    }
    // 2. Update stateful sequence
    this.header!.seq = nextSequence;
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
    return this.dumpPouch!.bulkDocs(previousBatch, { new_edits: false })
      .then((pouchDbResponse) => {
        if (pouchDbResponse.length > 0) {
          return Promise.reject("Error putting flushed docs");
        }
        return this.metaPouch!.get(toDumpDatabaseName(this.header!));
      })
      .then((headerDocument) => {
        return this.metaPouch!.put({
          ...headerDocument,
          seq: nextSequence,
        });
      })
      .then((pouchDbResponse) => {
        if (!pouchDbResponse.ok) {
          return Promise.reject(pouchDbResponse);
        }
        return Promise.resolve();
      });
  }
}
