import * as dotenv from 'dotenv'
dotenv.config()
// console.debug('process.env', process.env)

import fs from 'fs'

export class ConfigReader {

  readEnv (param, defaultValue) {
    console.debug('readEnv', param)
    var value = defaultValue
    if(fs.existsSync(`/run/secrets/${param}`)) {
      console.log(`Reading param ${param} from secrets...`)
      value = fs.readFileSync(`/run/secrets/${param}`, 'utf-8')
    } else {
      console.debug(`${param} is not in secrets`)
    }
    if(process.env[param]) {
      console.log(`Reading param ${param} from process.env...`)
      value = process.env[param]
    } else {
      console.debug(`${param} is not in process.env`)
    }
    return value.toString()
  }

  getConfig () {
    console.log('ConfigReader.getConfig()')
    console.debug('process.env', process.env)
    return {
      username: this.readEnv('SUBLEDGR_DB_USER', 'subledgr'), // process.env.SUBLEDGR_DB_USER     || 'subledgr',
      host:     this.readEnv('SUBLEDGR_DB_HOST', 'localhost'), // process.env.SUBLEDGR_DB_HOST     || 'localhost',
      database: this.readEnv('SUBLEDGR_DB_DATABASE', 'subledgr'), // process.env.SUBLEDGR_DB_DATABASE || 'subledgr',
      password: this.readEnv('SUBLEDGR_DB_PASSWORD', 'subledgr'), // process.env.SUBLEDGR_DB_PASSWORD || 'subledgr',
      port:     this.readEnv('SUBLEDGR_DB_PORT', '5432'), // process.env.SUBLEDGR_DB_PORT     || 5432,
      dialect: "postgres"
      // development: {
      //   "username": "subledgr",
      //   "password": "subledgr",
      //   "database": "subledgr",
      //   "host": "127.0.0.1",
      //   "dialect": "postgres"
      // },
      // test: {
      //   "username": "root",
      //   "password": null,
      //   "database": "database_test",
      //   "host": "127.0.0.1",
      //   "dialect": "mysql"
      // },
      // production: {
      //   "username": "root",
      //   "password": null,
      //   "database": "database_production",
      //   "host": "127.0.0.1",
      //   "dialect": "mysql"
      // }
    }
  }

}
