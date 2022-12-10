import * as PouchDBModule from "pouchdb";
const PouchDbAdapterIndexedDb = require("pouchdb-adapter-indexeddb").default;
const PouchDbPluginFind = require("pouchdb-find").default;

PouchDBModule.default.plugin(PouchDbAdapterIndexedDb);
PouchDBModule.default.plugin(PouchDbPluginFind);

export const PouchDB = PouchDBModule.default;
