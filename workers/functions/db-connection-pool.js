import { Sequelize } from 'sequelize';

import cfg from '../../config/config.js'
import { transactionModel } from '../../graphql/models/transaction.js'
import { accountModel } from '../../graphql/models/account.js'
import { accountBalanceModel } from '../../graphql/models/account-balance.js';

export class DbConnectionPool {

  constructor(cfg={}) {
    this.cfg = cfg
    this.pool = {}
    this.timestamps = {}

    // every 10 seconds, log the pool
    setInterval(() => {
      console.log('db pool', Object.keys(this.pool))
    }, 10_000)

    // every 20 seconds, close unused connections
    setInterval(() => {
      for (var dbId in this.pool) {
        if (this.timestamps.hasOwnProperty(dbId) && this.timestamps[dbId] < Date.now() - 60_000) {
          console.log(`db: closing connection for ${dbId}`)
          this.pool[dbId].close()
          delete this.pool[dbId]
          delete this.timestamps[dbId]
        } else {
          console.log(`db: keeping connection for ${dbId}`)
        }
      }
    }, 20_000)
  }

  async get(dbId) {
    console.debug(`getting db for ${dbId}`)
    var db
    if (!this.pool.hasOwnProperty(dbId)) {
      try {
        db = new Sequelize(
          this.cfg[dbId].database,
          this.cfg[dbId].username,
          this.cfg[dbId].password,
          this.cfg[dbId].options
        )
        // catch error, remove from pool
        await db.authenticate()

        this.pool[dbId] = db
      } catch (e) {
        console.error(`error connecting to ${dbId}`, e)
        console.debug('cfg', this.cfg)
      }
    } else {
      console.debug(`reusing db for ${dbId}`)
    }
    this.timestamps[dbId] = Date.now()
    db = this.pool[dbId]
    return db
  }

  closeAll() {
    for (var dbId in this.pool) {
      this.pool[dbId].close()
      delete this.pool[dbId]
    }
  }

}
