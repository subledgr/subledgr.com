
// force dotenv before any other imports
import './dotenv.js'
// to amend config, edit ../docker/.env

import { ConfigReader } from './config-reader.js'
const cr = new ConfigReader()

export default {
  // redis for bullmq
  redis: {
    // hostname = docker service name
    // host: process.env.SUBLEDGR_REDIS_HOST || 'subledgr-redis',
    host: cr.readEnv('SUBLEDGR_REDIS_HOST', 'subledgr-redis'),
    // host: 'localhost',
    // port: process.env.SUBLEDGR_REDIS_PORT || 6379,
    port: cr.readEnv('SUBLEDGR_REDIS_PORT', 6379),
  },

  bullmq: {
    // port: process.env.SUBLEDGR_BULLMQ_PORT || 3000,
    port: cr.readEnv('SUBLEDGR_BULLMQ_PORT', 3000),
  },

  sequelize: {
    database: cr.readEnv('SUBLEDGR_DB_DATABASE', 'subledgr'),
    username: cr.readEnv('SUBLEDGR_DB_USER', 'subledgr'),
    password: cr.readEnv('SUBLEDGR_DB_PASSWORD', 'subledgr'),
    options: {
      dialect: cr.readEnv('SUBLEDGR_DB_DIALECT', 'postgres'),
      // hostname = docker service name
      host: cr.readEnv('SUBLEDGR_DB_HOST', 'subledgr-datastore'),
      // host: 'localhost',
      // host: '192.168.1.91',
      port: cr.readEnv('SUBLEDGR_DB_PORT', 5432),
      logging: cr.readEnv('SUBLEDGR_DB_LOGGING', 'true') ==='true' || false, // .env is always a string
    },
  },

  db: {
    database: cr.readEnv('SUBLEDGR_DB_DATABASE', 'subledgr'),
    username: cr.readEnv('SUBLEDGR_DB_USER', 'subledgr'),
    password: cr.readEnv('SUBLEDGR_DB_PASSWORD', 'subledgr'),
    options: {
      dialect: cr.readEnv('SUBLEDGR_DB_DIALECT', 'postgres'),
      // hostname = docker service name
      host: cr.readEnv('SUBLEDGR_DB_HOST', 'subledgr-datastore'),
      // host: 'localhost',
      // host: '192.168.1.91',
      port: cr.readEnv('SUBLEDGR_DB_PORT', 5432),
      logging: cr.readEnv('SUBLEDGR_DB_LOGGING', 'true')==='true' || false, // .env is always a string
    },
  },
  indexDb: {
    database: cr.readEnv('SUBLEDGR_INDEXDB_DATABASE', 'subledgr'),
    username: cr.readEnv('SUBLEDGR_INDEXDB_USER', 'subledgr'),
    password: cr.readEnv('SUBLEDGR_INDEXDB_PASSWORD', 'subledgr'),
    options: {
      dialect: cr.readEnv('SUBLEDGR_INDEXDB_DIALECT', 'postgres'),
      host: cr.readEnv('SUBLEDGR_INDEXDB_HOST', 'subledgr-datastore'),
      port: cr.readEnv('SUBLEDGR_INDEXDB_PORT', 5432),
      logging: cr.readEnv('SUBLEDGR_INDEXDB_LOGGING', 'true')==='true' || false, // .env is always a string
    },
  },

}
