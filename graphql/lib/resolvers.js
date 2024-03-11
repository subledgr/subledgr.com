// import { createUser, findUserByEmail, findUserById, comparePassword } from '../models/user.js';
// import User from '../models/user.js'

import axios from 'axios'
import Binance from 'binance-api-node'
const binance = Binance.default()
import { Op } from 'sequelize';
import { createChainProviders } from './chains/providers.js';
// import { secrets } from './secrets.js';
import { Coinbase } from './coinbase-api.js';
import { SubscanAPI } from './subscan/index.js';
import { BiDirectionalMap } from './utils.js';
import { GraphQLScalarType, Kind } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import mjml2html from 'mjml'
import fs from 'fs'
import path from "path"
const __dirname = path.resolve();
import mustache from 'mustache'
import nodemailer from 'nodemailer'

import { ConfigReader }  from '../../config/config-reader.js'
import { Queue } from 'bullmq';
const cr = new ConfigReader('../docker/.env')
const cfg = cr.getConfig()
console.debug('cfg', cfg)

// const cb = new Coinbase({ apiKey: secrets.apiKey, apiSecret: secrets.apiSecret })
const cb = new Coinbase(cfg.coinbase)
// const dotsamaRestApiBaseUrl = process.env.DOTSAMA_REST_API_BASE_URL || 'http://localhost:3000'
const dotsamaRestApiBaseUrl = cfg.dotsamaRestApiBaseUrl

const mailer = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: process.env.NODEMAILER_SECURE==='true', // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

// Map from currencyCode to indexDb.transaction.chain
// TODO where should this go? and what is it used for?
const ccChain = {
  DOT: 'Polkadot',
  KSM: 'Kusama',
  DOCK: 'Dock'
}
// TODO: get this from the chain api
const ccDenom = {
  DOT: 10000000000,
  KSM: 1000000000000,
  DOCK: 1000000
}
const assetMap = new BiDirectionalMap({
  'dock': 'Dock PoS Mainnet',
  'polkadot': 'Polkadot',
  'kusama': 'Kusama'
})

const resolvers = {
  // handle BigInt data type
  BigInt: new GraphQLScalarType({
    name: 'BigInt',
    description: 'BigInt Scalar Type',
    parseValue (value) { return BigInt(value) },
    serialize (value) { return value.toString() },
    parseLiteral (ast) {
      if (ast.king === Kind.INT) return BigInt(ast.value)
      return null
    }
  }),
  Query: {
    me: async (_, args, { db, user }) => {
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const me = await db.User.findOne({ where: { id: user.id } })
      // don't use include. these will be populated by the User section below (if/when required)
      // , { include: ['profile', 'accounts', 'portfolios']});
      return me;
    },
    Accounts: async (_, args, context) => {
      console.debug('Accounts', args)
      const { ids, assetId, page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      // if (!user) throw new AuthenticationError(['AuthenticationError', 'You must be logged in']);
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const where = { userId: user?.id }
      if (ids) {
        where.id = { [Op.in]: ids }
      }
      if (assetId) {
        where.assetId = assetId
      }
      console.debug('where', where)
      list = await db.Account.findAll({ where })
      // return { Accounts: list, error: false, message: '' }
      return list || []
    },
    Account: async (_, args, context) => {
      const { id = null } = args
      console.debug('resolvers.Query.Account', id)
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const account = await db.Account.findOne({ where: { id, userId: user.id } }) // , { include: ['user', 'asset']})
      return account
    },
    Assets: async (_, args, context) => {
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const assets = await db.Asset.findAll();
      return assets;
    },
    // Cube: async (_, args, { db, user }) => {
    //   const prices = gql`query CubeQuery { 
    //     cube(
    //       where: { coingecko: { f_curr: { equals: "DOT" } , datetime: { inDateRange: "Last year" } } }
    //     ) {
    //       coingecko(orderBy: {datetime: asc}) {
    //         price
    //         datetime {
    //           day
    //         }
    //       }
    //     }
    //   }`
    // },
    Asset: async (_, args, { db, user }) => {
      const { id } = args
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const asset = await db.Asset.findByPk(id);
      return asset;
    },
    Currencies: async (_, __, { db, user }) => {
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const currencies = await db.Currency.findAll()
      return currencies
    },
    CryptoCurrencies: async (_, args, { user }) => {
      // if (!user) return requireAuthResponse
      console.debug('resolvers.js: CryptoCurrencies()')
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      var resp 
      try {
        resp = await cb.getCryptoCurrencies()
      } catch (err) {
        console.error(err)
      }
      return resp
    },
    MarketData: async (_, args, context, info) => {
      console.debug('MarketData()', args)
      var { fromCurrency = 'DOT', toCurrency = 'GBP', toDate, interval='h', periods=24 } = args
      var fromDate = moment(toDate).add(-periods, interval)
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const prices = db.Price.findAll({ where: { f_curr: fromCurrency, t_curr: toCurrency }, limit: 50 })
      // const intervalKeys = 
      // const intervals = new Map()
      // prices.forEach((price) => {
      //   const hour = moment(price.datetime).format('HH');
      //   hour.setMinutes(0, 0, 0);
      // })
      return prices
    },
    Users: async (parent, args, context, info) => {
      // console.debug(context)
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      // FIXME we need admin role
      throw new Error('who is calling this function?')
      const result = await db.User.findAll();
      return result;
    },
    UserById: async (parent, args, context, info) => {
      // console.debug(context)
      const { id } = args
      console.debug('userById()', id)
      const { token, user, db } = context
      console.debug('userById: user', user)
      const result = await db.User.findOne({ where: { id } });
      result.token = token
      // FIXME we need admin role
      throw new Error('who is calling this function?')
      return result;
    },
    UserByEmail: async (parent, args, context, info) => {
      // console.debug(context)
      const { email } = args
      console.debug('userByEmail()', email)
      const { user, db } = context
      const result = await db.User.findOne({ where: { email } });
      // FIXME we need admin role
      throw new Error('who is calling this function?')
      return result;
    },
    Portfolio: async (_, args, context) => {
      const { id } = args
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      var list = []
      const where = { id }
      const model = await db.Portfolio.findOne({ where }, { include: 'accounts' })
      return model
    },
    Portfolios: async (_, args, context) => {
      console.debug('Portfolios()', args)
      const { page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      try {
        list = await db.Portfolio.findAll({ where: { userId: user.id }, include: 'accounts' })
      } catch (err) {
        console.error(err)
      }
      // list = await db.Portfolio.findAll({}) //, { include: Account })
      // const wids = await db.Account.findAll({}, )
      // console.log('list', list)
      return list
    },
    /**
     * 
     * @param {*} args = { f_curr: String, t_curr: String }
     * @param {*} context 
     * @returns Latest Price for a given currency pair
     */
    Price: async (_, args, context) => {
      const { user, db } = context
      const { f_curr, t_curr, limit=100 } = args
      console.debug('Price', f_curr, t_curr)
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: limit })
      return prices[0]
    },
    /**
     * @param {*} args <p> { ids: [String], f_curr: String, t_curr: String },<br> ids is an array of f_curr</p>
     * @returns Price[] latest prices for a given list of currency pairs
     */
    Prices: async (_, args, context) => {
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { ids=[], f_curr, t_curr } = args
      var result = []
      for (let i = 0; i < ids.length; i++) {
        const f_curr = ids[i]
        const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: 1 })
        result.push(prices[0] || { datetime: '', f_curr, t_curr, value: 0})
      }
      return result
    },
    /**
     * @param {*} args = { f_curr: String, t_curr: String, period: String, limit: Int } period in [h, d, w, m, q, y]
     * @returns Price[] historical prices for a given currency pair
     */
    PriceHistory: async (_, args, context) => {
      const { user, db } = context
      const { f_curr, t_curr, period='h', limit, fromDate } = args
      console.debug('PriceHistory', f_curr, t_curr)
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: limit })
      // console.debug('prices', prices)
      const periodPrices = {}
      // group prices by period
      prices.forEach(price => {
        const date = new Date(price.datetime);
        // Create a datetime key for grouping (year-month-day-hour)
        var datetime = date.getFullYear()                                   // 2023 = YYYY
        if(['m','w','d','h'].includes(period)) datetime += '-' + String(date.getMonth() + 1).padStart(2, '0') // -MM // 12
        if(['d','h'].includes(period)) datetime += '-' + String(date.getDate()).padStart(2, '0')      // -DD // 31
        if(['h'].includes(period)) datetime += 'T' +String(date.getHours()).padStart(2, '0') + ':00Z'; // T23:00Z UTC
        if (!periodPrices[datetime]) {
          periodPrices[datetime] = [];
        }
        periodPrices[datetime].push(price.value);
      })
      console.debug('periodPrices', periodPrices)
      // calculate the averate price for each period
      const result = []
      for (const [datetime, values] of Object.entries(periodPrices)) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        result.push({ f_curr, t_curr, datetime, closing_price: avg });
      }
      // console.debug('result', result)
      return result
    },
    Profile: async (_, args, context) => {
      const { user, db } = context
      console.debug('Profile()', user)
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      return await db.Profile.findOne({ where: { id: user.id } })
    },
    SymbolPriceTicker: async (_, args, context) => {
      const { user } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { symbol } = args
      const price = await binance.prices({ symbol })
      console.debug('price', price)
      return { symbol, price: parseFloat(price[symbol]) }
    },
    Transactions: async (_, args, context) => {
      console.debug('Transactions', args)
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { assetId, accountId, address, ids, offset = 0, limit = 50 } = args
      const where = {}
      if (accountId) {
        // make sure this is an account for the user
        const account = await db.Account.findOne({ id: accountId, userId: user.id })
        if (!account) throw new Error('InvalidAccountError: no account for userid accountId combo')
        const asset = await db.Asset.findByPk(account.assetId)
        // const asset = await db.Asset.find({ where: { code: account.}})
        where.chain = assetMap.getByKey(asset.id) // dock => Dock PoS Mainnet

        console.warn('HELLO WORLD')

        // where[Op.or] = { recipientId: account.address, senderId: account.address }
        where[Op.or] = { toId: account.address, fromId: account.address }
      }
      // if (address) { where[Op.or] = { recipientId: address, senderId: address } }
      if (address) { where[Op.or] = { toId: address, fromId: address } }
      if (ids) {
        try {
          const accounts = await db.Account.findAll({ where: { id: { [Op.in]: ids } } })
          const addresses = accounts.map(m => m.address)
          //const account = accounts[0]
          //const asset = await db.Asset.findByPk(account.assetId)
          //where.chain = assetMap.getByKey(asset.id) // dock => Dock PoS Mainnet
          // where[Op.or] = { recipientId: { [Op.in]: addresses }, senderId: { [Op.in]: addresses } }
          where[Op.or] = { toId: { [Op.in]: addresses }, fromId: { [Op.in]: addresses } }
          // FIXME what if an account is found on multiple chains?
        } catch (err) {
          console.error(err)
        }
      }
      console.log('we are here')
      console.debug(JSON.stringify(where), offset, limit)
      const order = [['blockNumber', 'DESC'], ['id', 'DESC']]
      const list = await db.Transaction.findAll({ where, order, offset, limit })

      console.log('\nreturning', list.length, 'items\n')
      return list || []
    },
  },

  Account: {
    balance: async (account, args, context) => {
      console.debug('Account.balance', account.assetId, account.id, account.address)
      const { user, db } = context
      var ret = { balance: { feeFrozen: 0, free: 0, id: 0, miscFrozen: 0, pooled: 0, reserved: 0 } }
      // var asset = await db.Asset.findByPk(account.assetId)
      // var chain = ccChain[account.assetId]
      // if (!chain) return {}
      // chain = chain.toLowerCase()
      try {
        if (account.assetId === 'dock') {
          // read balance from chain (via api)
          var url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/system/account/${account.address}`
          console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret = rest.data.data
          // pooled value
          url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/nominationPools/poolMembersForAccount?accountId=${account.address}`
          console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
          // locks
          url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/balances/locks?accountId=${account.address}`
          // console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret.locks = rest.data.locks.map(lock => {
            return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
          }) || []
          // pending pool rewards
          url = `${dotsamaRestApiBaseUrl}/${account.assetId}/api/call/nominationPoolsApi/pendingRewards?accountId=${account.address}`
          // console.debug('url', url)
          var rest = await axios.get(url)
          console.log('rest.data', rest.data)
          if (rest.data) ret.pooledClaimable = rest.data.pendingRewards || 0
          // balance
          ret.balance = ret.free + ret.pooledClaimable + ret.pooled
          ret.id = account.id

        } else {
          // read balance from db
          const where = { id: account.id }
          const latest = await db.AccountBalance.findAll({ where, order: [['timestamp', 'DESC']], limit: 1 })
          ret = latest[0]
  
        }
      } catch(err) {
        // console.warn('last url', url)
        console.error('error', err.toString())
      }
      return ret
    },
    /**
     * Get blocks for an account, where there is a movement on account
     */
    blocks: async (account, args, context) => {
      const { user, db } = context
      const { offset = 0, limit = 50 } = args
      // get a distinct list of block numbers
      const blockNumbers = await db.Transaction.findAll({ where: {
        chainId: account.assetId,
        [Op.or]: { toId: account.address, fromId: account.address }
      }, attributes: ['blockNumber'], group: ['blockNumber'], order: [['blockNumber', 'ASC']]})
      // work out prevBlock and nextBlock for each block
      const blocks = blockNumbers.map((block, idx) => {
        return {
          blockNumber: block.blockNumber,
          nextBlock: blockNumbers[idx+1]?.blockNumber,
          prevBlock: blockNumbers[idx-1]?.blockNumber
        }
      })
      return blocks.slice(offset, offset + limit)
    },
    /**
     * Get block accounting for an account, where there is a movement on account
     */
    block: async (account, args, context) => {
      const { user, db } = context
      const { blockNumber } = args
      console.debug('Account.block', account.id, account.address, blockNumber)
      // console.debug('account', account)
      const asset = await db.Asset.findByPk(account.assetId)
      // get the previous block
      const prevBlock = await db.Transaction.findOne({ where: {
        chainId: account.assetId,
        [Op.or]: { fromId: account.address, toId: account.address },
        blockNumber: { [Op.lt]: blockNumber }
      }, order: [['blockNumber', 'DESC']] })
      const prevBlockBalance = await db.AccountBalance.findOne({ where: {
        id: account.id,
        blockNumber,
      }, order: [['timestamp', 'DESC']] })
      // get the current block balance
      const blockBalance = await db.AccountBalance.findOne({ where: {
        id: account.id,
        blockNumber,
      }})
      console.debug('blockBalance', blockBalance)
      // get the current block
      const events = await db.Transaction.findAll({ where: {
        chainId: account.assetId,
        [Op.or]: { fromId: account.address, toId: account.address },
        blockNumber: { [Op.eq]: blockNumber }
      }, order: [['timestamp', 'ASC']] })
      // get the next block
      const nextBlock = await db.Transaction.findOne({ where: {
        chainId: account.assetId,
        [Op.or]: { fromId: account.address, toId: account.address },
        blockNumber: { [Op.gt]: blockNumber }
      }, order: [['blockNumber', 'ASC']] })
      return {
        chainId: asset?.id || 'null',
        blockNumber,
        balance: blockBalance,
        prevBlock: { blockNumber: prevBlock?.blockNumber, balance: prevBlockBalance?.balance },
        events,
        nextBlock: { blockNumber: nextBlock?.blockNumber }
      }
    },
    balanceHistory: async (account, args, context) => {
      console.debug('Account.balanceHistory', account.assetId, account.id, account.address)
      const { user, db } = context
      var ret
      if (account.assetId === 'dock') {
        var url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/system/account/${account.address}`
        console.debug('url', url)
        var rest = await axios.get(url)
        if (rest.data) ret = rest.data.data
        // pooled value
        url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/nominationPools/poolMembersForAccount?accountId=${account.address}`
        console.debug('url', url)
        var rest = await axios.get(url)
        if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
        // locks
        url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/balances/locks?accountId=${account.address}`
        // console.debug('url', url)
        var rest = await axios.get(url)
        if (rest.data) ret.locks = rest.data.locks.map(lock => {
          return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
        }) || []
        // pending pool rewards
        url = `${dotsamaRestApiBaseUrl}/${account.assetId}/api/call/nominationPoolsApi/pendingRewards?accountId=${account.address}`
        // console.debug('url', url)
        var rest = await axios.get(url)
        console.log('rest.data', rest.data)
        if (rest.data) ret.pooledClaimable = rest.data.pendingRewards || 0
        // balance
        ret.balance = ret.free + ret.pooledClaimable + ret.pooled
        ret.id = account.id
        ret = [ret]
      } else {
        const { fromBlock, fromDate, limit = 50 } = args
        const where = { id: account.id }
        if (fromBlock) where.blockNumber = { [Op.gte]: fromBlock }
        if (fromDate) where.timestamp = { [Op.gte]: fromDate }
        ret = await db.AccountBalance.findAll({ where, order: [['timestamp', 'DESC']], limit })
      }
      return ret  
    },
    /**
     * @param {*} account 
     * @param {*} args { t_curr: String, period: String, granularity: String }
     * @returns array of { date, closing_balance, closing_price }
     */
    valueHistory: async (account, args, context) => {
      console.debug('Account.valueHistory()', account.id)
      const { user, db } = context
      const { t_curr='GBP', periods=30, granularity='DAY' } = args

      const asset = await db.Asset.findByPk(account.assetId)

      const sqlQuery = `
        WITH RECURSIVE DateSeries AS (
          SELECT CURDATE() - INTERVAL ${periods} ${granularity} as 'datetime'
          UNION ALL
          SELECT DATE_ADD(datetime, INTERVAL 1 ${granularity}) FROM DateSeries
          WHERE datetime < CURDATE()
        )
        SELECT 
          ds.datetime as 'datetime',
          COALESCE(
            (SELECT wb.balance
            FROM account_balance wb
            WHERE DATE(wb.timestamp) <= ds.datetime
            AND wb.id = "${account.id}"
            ORDER BY wb.timestamp DESC LIMIT 1),
            0
          ) as closing_balance,
          COALESCE(
            (SELECT p.value
            FROM price p
            WHERE DATE(p.datetime) <= ds.datetime
            AND p.f_curr = '${asset.code}'
            AND p.t_curr = '${t_curr}'
            ORDER BY p.datetime DESC LIMIT 1),
            0
          ) as closing_price
        FROM DateSeries ds
        ORDER BY 'datetime'`;
      // console.debug('sqlQuery', sqlQuery)

      const ret = await db.sequelize.query(sqlQuery)
      // console.debug('ret', ret)
      return ret[0]
    },
    User: async (account, args, context) => {
      const { user, db } = context
      const _user = await db.User.findByPk(account.userId)
      return _user
    },
    Asset: async (account, args, context) => {
      const { user, db } = context
      const asset = await db.Asset.findByPk(account.assetId)
      return asset
    },
    // Currency: async (account, args, context) => {
    //   const { user, db } = context
    //   const _curr = await db.Currency.findByPk(account.currencyCode)
    //   return _curr
    // },
    portfolios: async (account, args, context) => {
      const { user, db } = context
      console.debug('Account.portfolios()', account.id)
      const w = await db.Account.findByPk(account.id, { include: ['portfolios']})
      console.debug('account', w)
      // const pids = await db.PortfolioAccount.find({ where: { accountId: account.id } });
      // const portfolios = await db.Portfolio.find({ where: { id: { [Op.in]: pids } } })
      return w.portfolios
    },
    transactions: async (account, args, context) => {
      console.debug('Account.transactions()', account.assetId, account.address)
      const { user, db } = context
      const { limit=50 } = args

      // db.Transaction comes from the indexDb
      const _receipts = await db.Transaction.findAll({
        where: {
          chainId: account.assetId.toLowerCase(), // Polkadot => polkadot
          toId: account.address
        }
      })
      console.debug('Account.transactions() _receipts', _receipts.length)
      const _payments = await db.Transaction.findAll({
        // order: [ ['timestamp', 'DESC'] ],
        where: {
          chainId: account.assetId.toLowerCase(),
          fromId: account.address,
        }
      })
      console.debug('Account.transactions() _payments', _payments.length)
      return [..._receipts, ..._payments]
        .sort((a, b) => {
          if(Number(a.blockNumber) > Number(b.blockNumber)) return -1
          if(Number(a.blockNumber) < Number(b.blockNumber)) return 1
          return 0
        })
        .map(tx => {
          tx.address = account.address
          return tx
        })
        .slice(0, limit)
    },
    extrinsics: async (account, args, context) => {
      console.debug('Account.extrinsics()', account.currencyCode,ccChain[account.currencyCode].toLowerCase())
      // const subscan = new SubscanAPI({ apiKey: secrets.subscan.apiKey, chainId: ccChain[account.currencyCode].toLowerCase() })
      const subscan = new SubscanAPI({ apiKey: cfg.subscan.apiKey, chainId: ccChain[account.currencyCode].toLowerCase() })
      var row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success = undefined
      address = account.address
      const extrinsicsResponse = await subscan.scan.extrinsics(row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success)
      return extrinsicsResponse
    },
    chartData: async (account, args, context) => {
      // let periodicity = {
      //   D: { window: '24 hours', interval: 'hour', datePart: 'hour' },
      //   W: { window: '7 days',   interval: 'day',  datePart: 'day' },
      //   M: { window: '1 month',  interval: 'day',  datePart: 'day' },
      //   Q: { window: '3 months', interval: 'week', datePart: 'week' }
      // }
      // const { user, db } = context
      // const { period = 'D' } = args
      // const { window, interval, datePart } = periodicity[period]
      // let chain = ccChain[account.currencyCode]
      // let denom = ccDenom[account.currencyCode]
      // let sql = `WITH movements as (
      //   SELECT
      //     date_trunc('${datePart}', to_timestamp("timestamp" / 1000) ) AS "period",
      //     SUM(amount/${denom}) AS movement
      //   FROM transactions
      //   WHERE chain = '${chain}'
      //   AND ( recipientid = '${account.address}' 
      //         OR "senderId" = '${account.address}' )
      //   AND to_timestamp("timestamp" / 1000) >= cast( date_trunc('${datePart}', NOW() - INTERVAL '${window}') as timestamp)
      //   AND to_timestamp("timestamp" / 1000) < cast( date_trunc('${datePart}', NOW()) as timestamp)
      //   GROUP BY "period"       
      //  	UNION
      //   SELECT
      //     date_trunc('${datePart}', to_timestamp("timestamp" / 1000) ) AS "period",
      //     SUM(coalesce(amount/${denom} * -1, 0)) AS movement
      //   FROM transactions
      //   WHERE chain = '${chain}'
      //   AND ( recipientid = '${account.address}'
      //         OR "senderId" = '${account.address}' )
      //   AND to_timestamp("timestamp" / 1000) >= cast( date_trunc('${datePart}', NOW() - INTERVAL '${window}') as timestamp)
      //   AND to_timestamp("timestamp" / 1000) < cast( date_trunc('${datePart}', NOW()) as timestamp)
      //   GROUP BY "period"
      // )
      // SELECT
      //   "period",
      //   SUM(movement) OVER (ORDER BY "period") AS balance
      // FROM movements
      // ORDER BY "period"`
      // const [results, metadata] = await db.indexDb.query(sql)
      // return results
      return []
    },
    // Transactions: a
  },

  Portfolio: {
    User: async (portfolio, args, context) => {
      const { user, db } = context
      const _user = await db.User.findByPk(portfolio.userId)
      return _user
    },
    Currency: async (portfolio, args, context) => {
      console.debug('Portfolio.Currency()', portfolio.currencyCode)
      const { user, db } = context
      const _curr = await db.Currency.findByPk(portfolio.currencyCode)
      return _curr
    },
    Accounts: async (portfolio, args, context) => {
      console.debug('Portfolio.Accounts()', portfolio)
      const { user, db } = context
      const model = await db.Portfolio.findByPk(portfolio.id, { include: 'accounts' })
      // console.debug('Portfolio.Accounts', portfolio.id, model)
      return model.accounts
    },
    balanceHistory: async (portfolio, args, context) => {
      console.debug('Portfolio.balanceHistory()', portfolio, args)
      const { user, db } = context
      const { ids=[], periods=90, granularity='DAY' } = args
      const profile = await db.Profile.findByPk(user.id)
      const model = await db.Portfolio.findByPk(portfolio.id, { include: 'accounts' })
      const accounts = model.accounts
      const balanceHistory = await Promise.all(accounts.map(async account => {
        const asset = await db.Asset.findByPk(account.assetId)
        const sqlQuery = `
          WITH RECURSIVE DateSeries AS (
            SELECT CURDATE() - INTERVAL ${periods} ${granularity} as 'datetime'
            UNION ALL
            SELECT DATE_ADD(datetime, INTERVAL 1 ${granularity}) FROM DateSeries
            WHERE datetime < CURDATE()
          )
          SELECT 
            ds.datetime as 'datetime',
            COALESCE(
              (SELECT wb.balance
              FROM account_balance wb
              WHERE DATE(wb.timestamp) <= ds.datetime
              AND wb.id = "${account.id}"
              ORDER BY wb.timestamp DESC LIMIT 1),
              0
            ) as closing_balance
          FROM DateSeries ds
          ORDER BY 'datetime'`;
        const ret = await db.sequelize.query(sqlQuery)
        return { accountId: account.id, assetId: asset.id, balanceHistory: ret[0] }
      }))

      console.debug('Portfolio.balanceHistory() balanceHistory', balanceHistory)

      // unique asset ids
      var assetIds = accounts.map(account => account.assetId).filter((v, i, a) => a.indexOf(v) === i)
      // var assetIds = new Set(accounts.map(account => account.assetId));
      // assetIds = [...assetIds]
      console.debug('Portfolio.balanceHistory() assetIds', assetIds)
      
      const priceHistory = []
      // const priceHistory = await Promise.all(assetIds.map(async assetId => {
      //   const asset = await db.Asset.findByPk(assetId)
      //   const sqlQuery = `
      //     WITH RECURSIVE DateSeries AS (
      //       SELECT CURDATE() - INTERVAL ${periods} ${granularity} as 'datetime'
      //       UNION ALL
      //       SELECT DATE_ADD(datetime, INTERVAL 1 ${granularity}) FROM DateSeries
      //       WHERE datetime < CURDATE()
      //     )
      //     SELECT 
      //       ds.datetime as 'datetime',
      //       COALESCE(
      //         (SELECT p.value
      //         FROM price p
      //         WHERE DATE(p.datetime) <= ds.datetime
      //         AND p.f_curr = '${asset.code}'
      //         AND p.t_curr = '${profile.defaultCurrency}'
      //         ORDER BY p.datetime DESC LIMIT 1),
      //         0
      //       ) as closing_price
      //     FROM DateSeries ds
      //     ORDER BY 'datetime'`;
      //   const ret = await db.sequelize.query(sqlQuery)
      //   console.debug('priceHistory', assetId, ret)
      //   return { assetId, ret }
      // }))
      for( let i = 0; i < assetIds.length; i++) {
        let assetId = assetIds[i]
        const asset = await db.Asset.findByPk(assetId)
        const sqlQuery = `
          WITH RECURSIVE DateSeries AS (
            SELECT CURDATE() - INTERVAL ${periods} ${granularity} as 'datetime'
            UNION ALL
            SELECT DATE_ADD(datetime, INTERVAL 1 ${granularity}) FROM DateSeries
            WHERE datetime < CURDATE()
          )
          SELECT 
            ds.datetime as 'datetime',
            COALESCE(
              (SELECT p.value
              FROM price p
              WHERE DATE(p.datetime) <= ds.datetime
              AND p.f_curr = '${asset.code}'
              AND p.t_curr = '${profile.defaultCurrency}'
              ORDER BY p.datetime DESC LIMIT 1),
              0
            ) as closing_price
          FROM DateSeries ds
          ORDER BY 'datetime'`;
        const ret = await db.sequelize.query(sqlQuery)
        // console.debug('priceHistory', assetId, ret)
        priceHistory.push({ assetId, f_curr: asset.code, t_curr: profile.defaultCurrency, priceHistory: ret[0] })
      }

      priceHistory.forEach((price, idx) => {
        console.log('price', price)
      })

      // console.debug('Portfolio.balanceHistory() priceHistory', priceHistory)
      return { priceHistory, balanceHistory }
    },
  },

  Transaction: {
    Asset: async (transaction, args, context) => {
      const { db } = context
      // console.debug('', transaction)
      // const assetId = assetMap.getByValue(transaction.chainId)
      const asset = await db.Asset.findByPk(transaction.chainId)
      return asset
    }
  },

  User: {
    __resolveReference: async (user, args, context) => {
      const { fetchUserById } = context
      return fetchUserById(user.id)
    },
    Accounts: async (user, args, context) => {
      const { offset = 0, limit = 100 } = args
      const { db } = context
      // const model = db.User.findByPk(user.id, { include: ['accounts']})
      const list = await db.Account.findAll({ where: { userId: user.id} }, { offset, limit })
      return list
    },
    assets: async (user, args, context) => {
      const { offset = 0, limit = 100 } = args
      const { db } = context
      // console.debug('User.assets()', user)
      // const model = db.User.findByPk(user.id, { include: ['accounts']})
      const model = await db.User.findByPk(user.id, { include: ['assets', 'accounts'] })
      // console.debug('model', model)
      // get holdings for each asset
      // console.debug('accounts', model.accounts)
      const balancesP = model.accounts.map(account => {
        return resolvers.Account.balance(account, {}, context)
      })
      var balances = await Promise.all(balancesP)
      console.debug('balances', balances)
      const accounts = balances.map((balance, idx) => { return { currencyCode: model.accounts[idx].currencyCode, balance } })
      console.debug('accounts items', accounts.length)
      var assetBals = accounts.reduce((acc, account, aidx) => {
        console.debug('reduce...', aidx, account.currencyCode, typeof acc)
        if (Array.isArray(acc)) {
          const idx = acc.findIndex(x => x.currencyCode === account.currencyCode)
          if (idx === -1) {
            account.balance.free       = BigInt(account.balance?.free || 0) || 0n
            account.balance.reserved   = BigInt(account.balance?.reserved || 0) || 0n
            account.balance.miscFrozen = BigInt(account.balance?.miscFrozen || 0) || 0n
            account.balance.feeFrozen  = BigInt(account.balance?.feeFrozen || 0) || 0n
            account.balance.pooled     = BigInt(account.balance?.pooled || 0) || 0n
            acc.push(account)
          } else {
            acc[idx].balance.free       += BigInt(account.balance?.free || 0) || 0n
            acc[idx].balance.reserved   += BigInt(account.balance?.reserved || 0) || 0n
            acc[idx].balance.miscFrozen += BigInt(account.balance?.miscFrozen || 0) || 0n
            acc[idx].balance.feeFrozen  += BigInt(account.balance?.feeFrozen || 0) || 0n
            acc[idx].balance.pooled     += BigInt(account.balance?.pooled || 0) || 0n
          }
        } else {
          console.debug('acc is not an array', acc)
        }
        return acc
      }, [])

      console.debug('assetBals', assetBals)

      return assetBals
    },
    // Profile: async (user, args, context) => {
    // }
  },

  // Currency: {
  //   // price: async (currency, args, context) => {
  //   //   const { user, db } = context
  //   //   const {t_curr } = args
  //   //   console.debug('Currency.price', currency)
  //   //   const prices = await db.Price.findAll({ where: { f_curr: currency.code, t_curr }, order: [['datetime', 'DESC']], limit: 1 })
  //   //   return prices[0]
  //   // },
  // },

  // Price: {
  //   data: async (price, args, context) => {
  //   }
  // },

  Mutation: {
    register: async (_, { email, password }, { db }) => {
      // const user = await createUser(email, password);
      var user = await db.User.findOne({ where: { email }})
      var profile = {}
      var success = false
      if (!user) {
        success = true,
        user = await db.User.create({email, password});
        profile = await db.Profile.create({
          id: user.id,
          dateTimeFormat: 'YYYY.MM.DD HH:mm',
          defaultCurrency: 'GBP',
          locale: 'en-GB',
          defaultDecimals: 3,
          itemsPerPage: 10
        })
      } else {
        throw new Error('UserRegistrationError: email already exists. Please login or use password reset.')
      }
      const tpl = fs.readFileSync(__dirname + '/templates/register.mjml', 'utf-8')
      const html1 = mustache.render(tpl, { baseUrl: process.env.SUBLEDGR_APP_BASEURL })
      const html2 = mjml2html(html1, { validationLevel: 'skip' }).html
      const ret = await mailer.sendMail({
        // from: 'derek@metaspan.com',
        to: user.email,
        subject: 'Subledgr: New Account',
        text: '',
        html: html2
      })
      console.log('mailer resp', ret)
      const token = db.User.generateToken(user);
      user.token = token
      return { success, message: `User ${success ? 'registration ok' : 'exists'}`, id: user.id, email: user.email, profile, token };
    },
    login: async (_, args, { db }) => {
      // const user = await findUserByEmail(email);
      const  { email, password } = args
      const user = await db.User.scope('login').findOne({ where: { email }, include: ['profile'] });
      // const user = await db.User.findOne({ where: { email } });
      console.log('user', user)
      if (!user) {
        // throw new AuthenticationError('Invalid email or password');
        return { success: false, message: 'Invalid email or password', id: 0, email: email }
      }
      // const valid = await db.User.comparePassword(password, user.password);
      const valid = await user.comparePassword(password);
      if (!valid) {
        // throw new AuthenticationError('Invalid email or password');
        return { success: false, message: 'Invalid email or password', id: 0, email: email }
      }
      const token = db.User.generateToken(user);
      user.token = token
      return { success: true, message: 'Login ok', id: user.id, email: user.email, token, profile: user.profile };
    },
    saveProfile: async (_, args, { user, db }) => {
      console.debug('mutations.saveProfile()', args)
      const { dateTimeFormat, defaultCurrency, locale='en-GB', defaultDecimals, itemsPerPage } = args
      if (!user) throw new AuthenticationError('You must be logged in');
      const [profile, created] = await db.Profile.upsert({
        id: user.id, dateTimeFormat, defaultCurrency, locale, defaultDecimals, itemsPerPage
      }, { 
        dateTimeFormat, defaultCurrency, locale, defaultDecimals, itemsPerPage
      })
      return profile
    },
    reset: async (_, args, { db }) => {
      console.log('mutations.reset()', args)
      const  { token, email, password } = args
      console.log('123123123')
      const user = await db.User.findOne({ where: { email } });
      console.debug('log')
      if (!user) throw new Error('PasswordResetError: Invalid email');
      // 1. send resetToken
      // 2. recv resetToken
      if (token && password) {
        console.debug('we have token and password', user, token)
        if(token === user.resetToken) {
          user.password = password
          user.resetToken = null
          await user.save()
          return { success: true, message: 'Password updated, please login', id: user.id, email: user.email }
        } else {
          return { success: false, message: 'Invalid email or token', id: 0, email: email }
        }
      } else {
        user.resetToken = uuidv4()
        await user.save()
        console.debug('resetToken:', user.resetToken)
        // send the email here!
        const tpl = fs.readFileSync(__dirname + '/templates/password-reset.mjml', 'utf-8')
        const html1 = mustache.render(tpl, { resetToken: user.resetToken, baseUrl: process.env.SUBLEDGR_APP_BASEURL })
        const html2 = mjml2html(html1, { validationLevel: 'skip' }).html
        const ret = await mailer.sendMail({
          // from: 'derek@metaspan.com',
          to: user.email,
          subject: 'Subledgr: Password Reset',
          text: '',
          html: html2
        })
        console.log('mailer resp', ret)
        return { success: true, message: 'Reset started, please check your email', id: user.id, email: user.email }
      }
      // return { success: true, message: 'Reset ok, please login', id: user.id, email: user.email };
    },
    addAsset: async (_, args, context) => {
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { assetId } = args
      console.debug('addAsset', args)
      const userModel = await db.User.findByPk(user.id, { include: ['assets'] })
      const assetModel = await db.Asset.findByPk(assetId)
      // console.debug('userModel', userModel)
      const added = await userModel.addAsset(assetModel)
      console.debug('added', added)
      return { success: true, message: `Asset ${added ? 'created' : 'retrieved'}`, asset: assetModel, added }
    },
    // deleteAsset: async (_, args, context) => {
    //   const { user, db } = context
    //   // check user login
    //   if (!user) throw new AuthenticationError('You must be logged in');
    //   const { currencyCode } = args
    //   console.debug('deleteAsset', args)
    // },
    createPortfolio: async (_, args, context) => {
      const { user, db } = context
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { name } = args
      console.debug('createPortfolio', args)
      // check currency
      // const currency = await db.Currency.findOne({ where: { code: currencyCode } })
      // if (!currency) throw new Error(`Invalid currency code ${currencyCode}`)
      // check account exists?
      const where = { name, userId: user.id }
      const uuid = uuidv4()
      var [portfolio, created] = await db.Portfolio.findOrCreate({ where, defaults: { id: uuid, where } })
      return { success: created, message: `Portfolio ${created ? 'created' : 'retrieved'}`, portfolio }
    },
    savePortfolio: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { id, name } = args
      console.debug('savePortfolio', args)
      // check account exists?
      var portfolio = await db.Portfolio.findOne({ where: { id, userId: user.id } })
      if (!portfolio) throw new Error(`Invalid portfolio id ${id}`)
      portfolio.name = name
      await portfolio.save()
      return { success: true, message: `Portfolio updated`, portfolio }
    },
    deletePortfolio: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { id, name } = args
      console.debug('deletePortfolio', args)
      // check account exists?
      var portfolio = await db.Portfolio.findOne({ where: { id, userId: user.id } })
      if (!portfolio) throw new Error(`Invalid portfolio id ${id}`)
      await portfolio.destroy()
      return { success: true, message: `Portfolio deleted` }
    },
    setPortfolioAccounts: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      // Find or create accounts based on accountIds
      const { id, accountIds } = args
      const portfolio = await db.Portfolio.findByPk(id)
      if (!portfolio) throw new Error(`Invalid portfolio id ${id}`)
      try {
        const accounts = await Promise.all(
          accountIds.map(async (accountId) => {
            const [account, created] = await db.Account.findOrCreate({
              where: { id: accountId, userId: user.id }, // Put additional conditions if any
            });
            return account;
          })
        );
        if (!accounts.length) throw new Error('No accounts found');
        // Associate accounts with the portfolio
        await portfolio.setAccounts(accounts);
        return { success: true, message: `Portfolio ${id} updated`, portfolio }
          
      } catch (err) {
        console.error(err)
        return { success: false, message: `Portfolio ${id} not updated`, portfolio }
      }
    },
    createAccount: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { name, assetId, address } = args
      console.debug('createAccount', args)
      // check currency
      const asset = await db.Asset.findOne({ where: { id: assetId } })
      if (!asset) throw new Error(`Invalid asset id ${assetId}`)
      // check account exists?
      // create a UUID
      const uuid = uuidv4()
      var [account, created] = await db.Account.findOrCreate({
        where: {
          assetId,
          address,
          userId: user.id
        },
        defaults: {
          id: uuid.toString(),
          name,
          assetId,
          address,
          userId: user.id
        }
      })
      // const account = await db.Account.create({ name, currencyId: curr.id, address, userId: user.id })
      // trigger the getAccountHistory worker
      const q_getAccountHistory = new Queue('getAccountHistory', { connection: cfg.redis })
      await q_getAccountHistory.add('getAccountHistory', { chainId: assetId, accountId: account.id })
      // return { success: created, message: `Account ${created ? 'created' : 'retrieved'}`, account }
      return account
    },
    deleteAccount: async (_, args, context) => {
      console.debug('deleteAccount', args, context.user)
      const { user, db } = context
      // check user login
      if (!user) throw new Error('AuthenticationError: You must be logged in');
      const { id } = args
      // // check currency
      // const curr = await db.Currency.findOne({ where: { code: currencyCode } })
      // if (!curr) throw new Error(`Invalid currency code ${currencyCode}`)
      // check account exists?
      var account = await db.Account.findOne({ where: { id, userId: user.id }})
      if (!account) throw new Error(`Invalid account ${id}`)
      await db.AccountBalance.destroy({ where: { id: account.id } })
      const ret = await account.destroy()
      // const ret = db.Account.destroy({ where: { id, userId: user.id } })
      console.debug('deleteAccount - destroy', ret)
      return { success: true, message: `Account deleted` }
    },
  },
};

export { resolvers }
