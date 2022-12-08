## Getting started

Gwapo is developed against NodeJS v14 LTS.

```bash
git clone git@github.com:bever1337/gwapo.git
cd gwapo
npm install
# source database
# if any scraper script fails, re-run it until it succeeds
node scraper/source-continents.js
node scraper/source-materials.js
node scraper/source-items.js # this one takes a while
# build the database dump
node scraper/dump.js
# start the app!
npm run start
```

```plantuml
@startuml
title Gwapo

package "Guild Wars 2" {
  cloud "v2 API" {
    cloud "Authorized API"
    cloud "Public API"
  }
  cloud "Tile Service"
}

node "Build Pipeline" {
  database TmpPouch
}

node "Gwapo Application" {
  database Store
  database Pouch
}

"Public API"-->TmpPouch
[TmpPouch]-->Pouch
[Authorized API]-->Store

@enduml
```
