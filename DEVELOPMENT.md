# Development

For development we run the services locally.

# Components

## database migrations
The database structure is abstracted with sequelize
```bash
cd ./graphql/models
```

## migrations
maintained in the api

```bash
cd graphql
ls -l ./migrations
```

## database - default

Run a local postgres database with docker
Configure the database connection in [config.js](./config/config.js)

## database - indexDb

Run a local postgres | hydra database with docker
Or connect to production database...
Configure the database connection in [config.js](./config/config.js)

### indexing job(s)

subsquid indexer per chain
- subledgr/subsquid-kusama [](https://github.com/subledgr/subsquid-kusama)
- subledgr/subsquid-polkadot [](https://github.com/subledgr/subsquid-polkadot)

## api - graphql

Depends on database and indexDb
```bash
cd graphql
nodemon server.js
```

## cube

```bash
cd cube
# has to run in docker
docker compose up
```

## workers

```bash
cd workers
nodemon workers.js
```

## frontend - vue3

```bash
cd vue3
yarn dev
```

## cube - not integrated yet
WIP
