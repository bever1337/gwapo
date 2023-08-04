import * as PouchDBModule from "pouchdb";
import PouchDbAdapterIndexedDb from "pouchdb-adapter-indexeddb";

PouchDBModule.default.plugin(PouchDbAdapterIndexedDb);

export const PouchDB = PouchDBModule.default;
export const DB_NAME = "gwapo";
export const getPouch = () => new PouchDB(DB_NAME, { adapter: "indexeddb" });
///@ts-ignore
window.pouch = getPouch();
