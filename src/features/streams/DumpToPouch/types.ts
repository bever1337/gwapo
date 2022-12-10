/** From database dump */
export interface DumpHeader {
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

/** From database dump */
export interface DumpSequence {
  seq: number;
}

/** From database dump */
export interface DumpDocs {
  docs: { _id: string; _rev: string; [key: string]: any }[];
}

/** Stream input from database dump */
export type DumpJson = DumpHeader | DumpSequence | DumpDocs;

/** Includes pouchDB properties */
export type DumpHeaderDocument = DumpHeader & {
  /** CouchDB Document id */
  _id: `dump_${string}`;
  /** Json schema id */
  $id: "dump";
  /** Dump checkpointing */
  seq: number;
};

export enum DumpToPouchSinkState {
  Uninitialized,
  Initialized,
  Docs,
  Sequence,
  Aborted,
}

export interface DumpToPouchSinkActions {
  /** throw error to the stream with reason */
  error(reason: string): void;
  /**
   * Checks the length of the buffer, and if it is
   * equal-to-or-larger-than the batch size, writes
   * the buffer to the database.
   */
  flush(sequence: DumpSequence["seq"], force?: boolean): Promise<void>;
  /** begin with Headers */
  initialize(header: DumpHeader): Promise<void>;
  /** buffers current line of docs */
  buffer(docs: DumpDocs["docs"]): Promise<void>;
}

export interface DumpStateImplementation {
  /** Stream abort event is always intercepted by the machine */
  abort?: never;
  /** Stream close event */
  close(actions: DumpToPouchSinkActions): Promise<DumpToPouchSinkState.Aborted>;
  /** Stream write event */
  docs(
    input: DumpDocs,
    actions: DumpToPouchSinkActions
  ): Promise<DumpToPouchSinkState>;
  /** Stream write event */
  headers(
    input: DumpHeader,
    actions: DumpToPouchSinkActions
  ): Promise<DumpToPouchSinkState>;
  /** Stream write event */
  sequence(
    input: DumpSequence,
    actions: DumpToPouchSinkActions
  ): Promise<DumpToPouchSinkState>;
  /** Stream start event is always intercepted by the machine */
  start?: never;
}
