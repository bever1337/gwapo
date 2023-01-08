const PouchDB = require("pouchdb");
const pouchDbMemoryAdapter = require("pouchdb-adapter-memory");
const pouchDbReplicationStream = require("pouchdb-replication-stream");

PouchDB.plugin(pouchDbMemoryAdapter);
PouchDB.plugin(pouchDbReplicationStream.plugin);
PouchDB.adapter(
  "writableStream",
  pouchDbReplicationStream.adapters.writableStream
);

module.exports.PouchDB = PouchDB;

module.exports.fetch = (() => {
  const fetchPromise = import("node-fetch").then(({ default: fetch }) => fetch);
  return function fetch(requestInfo, requestInit) {
    return fetchPromise.then((resolvedFetch) =>
      resolvedFetch(requestInfo, requestInit)
    );
  };
})();
