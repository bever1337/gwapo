const fs = require("fs");

fs.writeFileSync(
  `${process.cwd()}/scraper/.env`,
  `START_TIME=${new Date().toISOString()}`
);
