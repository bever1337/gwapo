import * as PouchDBModule from "pouchdb";

PouchDBModule.default.plugin(require("pouchdb-load/dist/pouchdb.load"));
PouchDBModule.default.plugin(require("pouchdb-adapter-indexeddb").default);
PouchDBModule.default.plugin(require("pouchdb-find").default);

export const PouchDB = PouchDBModule.default;

interface WithLoad extends PouchDB.Database {
  load(uri: string): Promise<void>;
}

export const pouch = new PouchDB("gwapo-db", {
  adapter: "idb",
}) as WithLoad;
