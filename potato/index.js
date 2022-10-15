/* eslint-env node */
const nano = require("nano");
require("dotenv").config();

async function main() {
  const couch = nano({
    url: `${process.env.NANO_PROTOCOL}://${process.env.NANO_USERNAME}:${process.env.NANO_PASSWORD}@${process.env.NANO_HOST}`,
  });
  await couch.db.list();
  console.log("success");
}

main();
