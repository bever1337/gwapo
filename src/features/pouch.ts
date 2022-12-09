import * as PouchDBModule from "pouchdb";
const PouchDbAdapterIndexedDb = require("pouchdb-adapter-indexeddb").default;
const PouchDbPluginFind = require("pouchdb-find").default;
const PouchDbReplicationStream = require("pouchdb-replication-stream/dist/pouchdb.replication-stream");

PouchDBModule.default.plugin(PouchDbAdapterIndexedDb);
PouchDBModule.default.plugin(PouchDbPluginFind);
PouchDBModule.default.plugin(PouchDbReplicationStream.plugin);

const PouchDB = PouchDBModule.default as PouchDB.Static<{}> & {
  adapter(name: string, stream: any): void;
};

// PouchDB.adapter(
//   "writableStream",
//   PouchDbReplicationStream.adapters.writableStream
// );

export { PouchDB };

export const pouch = new PouchDB("gwapo-db", {
  adapter: "indexeddb",
});
