import { browser } from "$app/environment";
import * as PouchDBModule from "pouchdb";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/// @ts-ignore
import PouchDbAdapterIndexedDb from "pouchdb-adapter-indexeddb";

if (browser) {
  PouchDBModule.default.plugin(PouchDbAdapterIndexedDb);
}

export const PouchDB = PouchDBModule.default;
const pouchOptions = browser ? { adapter: "indexeddb" } : {};
export const DB_NAME = browser ? "gwapo" : "http://127.0.0.1:5984/gwapo";
export const getPouch = () => new PouchDB(DB_NAME, pouchOptions);
