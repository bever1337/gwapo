const PouchDB = require("pouchdb");

module.exports.PouchDB = PouchDB;

const fetch = (() => {
  const fetchPromise = import("node-fetch").then(({ default: fetch }) => fetch);
  return function fetch(requestInfo, requestInit) {
    return fetchPromise.then((resolvedFetch) =>
      resolvedFetch(requestInfo, requestInit)
    );
  };
})();

module.exports.fetch = fetch;

module.exports.gatekeptFetch = (requestInfo, requestInit) => {
  const fetchCtor = () =>
    fetch(requestInfo, requestInit).then((response) => response.json());
  return Promise.all([
    fetchCtor().catch((error) => {
      console.error(error);
      console.warn("RETRYING", requestInfo);
      return fetchCtor();
    }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    }),
  ]).then(([response]) => response);
};
