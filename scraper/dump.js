const fs = require("fs");
const PouchDB = require("pouchdb");
const replicationStream = require("pouchdb-replication-stream");

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter("writableStream", replicationStream.adapters.writableStream);

async function main() {
  const pouch = new PouchDB("gwapo-db");

  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
