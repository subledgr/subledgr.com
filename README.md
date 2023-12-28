# subledgr.com

## components

- frontend - vue3
  - api graphql client

- api - graphql
  - sequelize 
    => database (mariadb, models, exchange rates)
    => indexDb (postgres, history)
  - [dotsama REST api](https://github.com/metaspan/dotsama-rest-api) => RPC nodes (balances, ...)

- cube - not integrated yet
  - => db + indexDB

- indexing
  - subsquid (ksm, dot, dock)
  - https://github.com/subledgr/subsquid-kusama
  - https://github.com/subledgr/subsquid-polkadot

- bullmq
  - redis
  - server 
    - ui
    - where do we trigger jobs?
  - workers (read jobs from redis)
    - get-prices-coingecko
    - get-prices-coinmarketcap

## production

For production all services run in docker, see [docker-compose.yml](./docker/docker-compose.yml).

## development

For development we run the services locally.
See [DEVELOPMENT.md](./DEVELOPMENT.md) for production.
