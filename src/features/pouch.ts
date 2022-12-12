import * as PouchDBModule from "pouchdb";
const PouchDbAdapterIndexedDb = require("pouchdb-adapter-indexeddb").default;

PouchDBModule.default.plugin(PouchDbAdapterIndexedDb);

export const PouchDB = PouchDBModule.default;
