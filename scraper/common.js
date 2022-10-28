const PouchDB = require("pouchdb");
const replicationStream = require("pouchdb-replication-stream");

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream);

module.exports.pouch = new PouchDB("gwapo-db");
