import fs from 'fs'
import dotenv from 'dotenv'

/**
 * Relies on dotenv already executed
 * 0. set default
 * 1. check /run/secrets - portainer?
 * 2. check process.env
 */
export class ConfigReader {

  constructor(envFile = '../docker/.env') {
    dotenv.config({ path: envFile });
  }

  /**
   * @param {*} param 
   * @param {*} defaultValue 
   * @returns 
   */
  readEnv (param, defaultValue) {
    var value = defaultValue
    if(fs.existsSync(`/run/secrets/${param}`)) {
      console.log(`Reading param ${param} from secrets...`)
      value = fs.readFileSync(`/run/secrets/${param}`, 'utf-8')
    }
    if(process.env[param]) {
      console.log(`Reading param ${param} from process.env...`)
      value = process.env[param]
    }
    return value.toString()
  }

  /**
   */
  getConfig () {
    console.log('ConfigReader.getConfig()')
    return {
      // redis for bullmq
      redis: {
        // hostname = docker service name
        // host: process.env.SUBLEDGR_REDIS_HOST || 'subledgr-redis',
        host: this.readEnv('SUBLEDGR_REDIS_HOST', 'subledgr-redis'),
        // host: 'localhost',
        // port: process.env.SUBLEDGR_REDIS_PORT || 6379,
        port: this.readEnv('SUBLEDGR_REDIS_PORT', 6379),
      },
    
      bullmq: {
        // port: process.env.SUBLEDGR_BULLMQ_PORT || 3000,
        port: this.readEnv('SUBLEDGR_BULLMQ_PORT', 3000),
      },
    
      // sequelize: {
      //   database: this.readEnv('SUBLEDGR_DB_DATABASE', 'subledgr'),
      //   username: this.readEnv('SUBLEDGR_DB_USER', 'subledgr'),
      //   password: this.readEnv('SUBLEDGR_DB_PASSWORD', 'subledgr'),
      //   options: {
      //     dialect: this.readEnv('SUBLEDGR_DB_DIALECT', 'postgres'),
      //     // hostname = docker service name
      //     host: this.readEnv('SUBLEDGR_DB_HOST', 'subledgr-datastore'),
      //     // host: 'localhost',
      //     // host: '192.168.1.91',
      //     port: this.readEnv('SUBLEDGR_DB_PORT', 5432),
      //     logging: this.readEnv('SUBLEDGR_DB_LOGGING', 'true') ==='true' || false, // .env is always a string
      //   },
      // },
    
      db: {
        database: this.readEnv('SUBLEDGR_DB_DATABASE', 'subledgr'),
        username: this.readEnv('SUBLEDGR_DB_USER', 'subledgr'),
        password: this.readEnv('SUBLEDGR_DB_PASSWORD', 'subledgr'),
        options: {
          dialect: this.readEnv('SUBLEDGR_DB_DIALECT', 'postgres'),
          // hostname = docker service name
          host: this.readEnv('SUBLEDGR_DB_HOST', 'subledgr-datastore'),
          // host: 'localhost',
          // host: '192.168.1.91',
          port: this.readEnv('SUBLEDGR_DB_PORT', 5432),
          logging: this.readEnv('SUBLEDGR_DB_LOGGING', 'true')==='true' || false, // .env is always a string
        },
      },
      // planned: move to lib/utils.js: IndexDbFactory()
      indexDb: {
        database: this.readEnv('SUBLEDGR_INDEXDB_DATABASE', 'subledgr'),
        username: this.readEnv('SUBLEDGR_INDEXDB_USER', 'subledgr'),
        password: this.readEnv('SUBLEDGR_INDEXDB_PASSWORD', 'subledgr'),
        options: {
          dialect: this.readEnv('SUBLEDGR_INDEXDB_DIALECT', 'postgres'),
          host: this.readEnv('SUBLEDGR_INDEXDB_HOST', 'subledgr-datastore'),
          port: this.readEnv('SUBLEDGR_INDEXDB_PORT', 5432),
          logging: this.readEnv('SUBLEDGR_INDEXDB_LOGGING', 'true')==='true' || false, // .env is always a string
        },
      },

      graphql: {
        port: this.readEnv('SUBLEDGR_GRAPHQL_PORT', 4000),
      },

      jwtSecretKey: this.readEnv('SUBLEDGR_JWT_SECRET_KEY', 'thisIsASecret'),
      dotsamaRestApiBaseUrl: this.readEnv('DOTSAMA_REST_API_BASE_URL', 'http://localhost:3000'),

      subscan: {
        apiKey: this.readEnv('SUBSCAN_API_KEY', 'secrets.subscan.apiKey')
      },

      coinbase: {
        apiKey: this.readEnv('COINBASE_API_KEY', ''),
        apiSecret: this.readEnv('COINBASE_API_SECRET', '')
      },
    
    }
  }

}

// ;(async() => {
//   const cr = new ConfigReader()
//   const config = cr.getConfig()
//   console.log(config)
// })()
