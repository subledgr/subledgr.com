import moment from 'moment'
import { DataTypes, Op, Sequelize, Model } from 'sequelize'

import { priceModel } from '../data/models/price.js'
// import { memberModel } from '../data/models/member.js'
// import { membershipLevelModel } from '../data/models/membership-level.js'
// import { serviceModel } from '../data/models/service.js'
// import { memberServiceModel } from '../data/models/member-service.js'
// import { memberServiceNodeModel } from '../data/models/member-service-node.js'
// import { monitorModel } from '../data/models/monitor.js'
// import { healthCheckModel } from '../data/models/health-check.js'
import { logModel } from '../data/models/log.js'
// import { geoDnsPoolModel } from '../data/models/geo-dns-pool.js'

// import { Umzug, SequelizeStorage } from 'umzug'

import cfg from '../config/config.js'
// import { config as configLocal } from '../config/config.local.js'
// const cfg = Object.assign(config, configLocal)

const sequelize = new Sequelize(
  cfg.sequelize.database,
  cfg.sequelize.username,
  cfg.sequelize.password,
  cfg.sequelize.options
)

class DataStore {
  // Chain = undefined
  // GeoDnsPool = undefined
  // HealthCheck = undefined
  // Log = undefined
  // Member = undefined
  // MembershipLevel = undefined
  // MemberService = undefined
  // MemberServiceNode = undefined
  // Service = undefined
  // Monitor = undefined
  Price = undefined

  pruning = {
    age: 90 * (24 * 60 * 60), // days as seconds
    interval: 1 * (24 * 60 * 60), // 1 day as seconds
  }

  constructor(config = {}) {
    console.debug('DataStore()', config)

    this.pruning = Object.assign(this.pruning, config.pruning)
    const Price = sequelize.define(priceModel.options.tableName, priceModel.definition, {
      ...priceModel.options,
      sequelize,
    })
    // // define chain
    // const Chain = sequelize.define(chainModel.options.tableName, chainModel.definition, {
    //   ...chainModel.options,
    //   sequelize,
    // })
    // Chain.hasMany(Chain, {
    //   foreignKey: 'relayChainId',
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // })
    // Chain.belongsTo(Chain, {
    //   foreignKey: 'relayChainId',
    // })

    // define log
    const Log = sequelize.define('log', logModel.definition, { ...logModel.options, sequelize })
    // MemberServiceNode.hasMany(Log, {
    //   as: 'logs',
    //   foreignKey: 'peerId',
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // })
    // Log.belongsTo(MemberServiceNode, {
    //   as: 'node',
    //   foreignKey: 'peerId',
    // })
    // MemberService.hasMany(Log, {
    //   as: 'logs',
    //   foreignKey: 'memberServiceId',
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // })
    // Log.belongsTo(MemberService, {
    //   as: 'memberService',
    //   foreignKey: 'memberServiceId',
    // })

    this.Price = Price
    // this.GeoDnsPool = GeoDnsPool
    // this.HealthCheck = HealthCheck
    this.Log = Log
    // this.Member = Member
    // this.MembershipLevel = MembershipLevel
    // this.MemberService = MemberService
    // this.MemberServiceNode = MemberServiceNode
    // this.Monitor = Monitor
    // this.Service = Service
  }

  /*
  async migrate() {
    const umzug = new Umzug({
      migrations: { glob: './data/migrations/*.js' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    })
    await umzug.up()
  }
  */

  async connect() {
    console.debug('Connecting datastore...')
    return await sequelize.connectionManager.getConnection()
  }

  async close() {
    console.debug('Closing datastore...')
    return await sequelize.close()
  }

  async log(level = 'info', data) {
    const model = {
      level,
      data,
    }
    return this.Log.create(model)
  }

  async prune() {
    console.debug('DataStore.prune()', this.pruning)
    // const marker = moment.utc().add(-this.pruning.age, 'seconds')
    // console.debug('marker', marker)
    // var result
    // result = await this.HealthCheck.destroy({
    //   where: { createdAt: { [Op.lt]: marker.format('YYYY-MM-DD HH:mm:ss') } },
    // })
    // console.debug('HealthCheck.prune: delete', result)
  }
}

export { DataStore }
// module.exports = { DataStore } // for ES6 module compatibility // workers/index.js needs this...?
