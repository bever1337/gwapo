const fs = require("fs");
const { pouch } = require("./common");

async function main() {
  await pouch.dump(
    fs.createWriteStream(`${process.cwd()}/public/dump.txt`, {
      encoding: "utf-8",
    })
  );

  console.log("exit");
}

main();
