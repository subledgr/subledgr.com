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
const cr = new ConfigReader('../docker/.env')

// const cb = new Coinbase({ apiKey: secrets.apiKey, apiSecret: secrets.apiSecret })
const cb = new Coinbase({ apiKey: cr.readEnv('COINBASE_API_KEY', ''), apiSecret: cr.readEnv('COINBASE_API_SECRET', '') })
// const dotsamaRestApiBaseUrl = process.env.DOTSAMA_REST_API_BASE_URL || 'http://localhost:3000'
const dotsamaRestApiBaseUrl = cr.readEnv('DOTSAMA_REST_API_BASE_URL', 'http://localhost:3000')

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

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}
const requireAuthResponse = { error: true, message: 'You must be authenticated'}

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
      if (!user) {
        throw new AuthenticationError('You must be logged in');
      }
      const me = await db.User.findOne({ where: { id: user.id } })
      // don't use include. these will be populated by the User section below (if/when required)
      // , { include: ['profile', 'wallets', 'portfolios']});
      return me;
    },
    Assets: async (_, args, { db, user }) => {
      // if (!user) { throw new AuthenticationError('You must be logged in'); }
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
      // if (!user) { throw new AuthenticationError('You must be logged in') }
      const asset = await db.Asset.findByPk(id);
      return asset;
    },
    Currencies: async (_, __, { db, user }) => {
      // if (!user) { throw new AuthenticationError('You must be logged in') }
      const currencies = await db.Currency.findAll()
      return currencies
    },
    CryptoCurrencies: async (_, args, { user }) => {
      // if (!user) return requireAuthResponse
      console.debug('resolvers.js: CryptoCurrencies()')
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
      // console.debug('resolvers.Query.users:', user, db)
      // if (!user) {
      //   throw new AuthenticationError('You must be logged in');
      // }
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
      return result;
    },
    UserByEmail: async (parent, args, context, info) => {
      // console.debug(context)
      const { email } = args
      console.debug('userByEmail()', email)
      const { user, db } = context
      const result = await db.User.findOne({ where: { email } });
      return result;
    },
    Portfolio: async (_, args, context) => {
      const { id } = args
      const { user, db } = context
      if (!user) { return { list: [], error: true, message: 'You must be logged in', list } }
      var list = []
      const where = { id }
      const model = await db.Portfolio.findOne({ where }, { include: 'wallets' })
      return model
    },
    Portfolios: async (_, args, context) => {
      console.debug('Portfolios()', args)
      const { page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      if (!user) { return { error: true, message: 'You must be logged in', list } }
      try {
        list = await db.Portfolio.findAll({ where: { userId: user.id }, include: 'wallets' })
      } catch (err) {
        console.error(err)
      }
       // list = await db.Portfolio.findAll({}) //, { include: Wallet })
      // const wids = await db.Wallet.findAll({}, )
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
      // if (!user) { return { error: true, message: 'You must be logged in', list } }
      const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: limit })
      return prices[0]
    },
    /**
     * @param {*} args <p> { ids: [String], f_curr: String, t_curr: String },<br> ids is an array of f_curr</p>
     * @returns Price[] latest prices for a given list of currency pairs
     */
    Prices: async (_, args, context) => {
      const { user, db } = context
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
      // if (!user) { return { error: true, message: 'You must be logged in', list } }
      const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: limit })
      const periodPrices = {}
      // group prices by period
      prices.forEach(price => {
        const date = new Date(price.datetime);
        // Create a key for grouping (year-month-day-hour)
        var key = date.getFullYear() + '-' +                                // 2023-
          String(date.getMonth() + 1).padStart(2, '0') + '-' +              // 01-
          String(date.getDate()).padStart(2, '0')                           // 31
          if(['h'].includes(period)) key += 'T' +String(date.getHours()).padStart(2, '0') + ':00Z'; // T23:00Z UTC
        if (!periodPrices[key]) {
          periodPrices[key] = [];
        }
        periodPrices[key].push(price.value);
      })
      // calculate the averate price for each period
      const result = []
      for (const [key, values] of Object.entries(periodPrices)) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        result.push({ f_curr, t_curr, key, price: avg });
      }
      return result
    },
    Profile: async (_, args, context) => {
      const { user, db } = context
      console.debug('Profile()', user)
      if (!user) { return { error: true, message: 'You must be logged in' } }
      return await db.Profile.findOne({ where: { id: user.id } })
    },
    SymbolPriceTicker: async (_, args, context) => {
      const { symbol } = args
      const price = await binance.prices({ symbol })
      console.debug('price', price)
      return { symbol, price: parseFloat(price[symbol]) }
    },

    Transactions: async (_, args, context) => {
      console.debug('Transactions', args)

      const { assetId, walletId, address, ids, offset = 0, limit = 50 } = args
      const { user, db } = context
      const where = {}
      if (walletId) {
        const wallet = await db.Wallet.findByPk(walletId)
        const asset = await db.Asset.findByPk(wallet.assetId)
        // const asset = await db.Asset.find({ where: { code: wallet.}})
        where.chain = assetMap.getByKey(asset.id) // dock => Dock PoS Mainnet

        console.warn('HELLO WORLD')

        // where[Op.or] = { recipientId: wallet.address, senderId: wallet.address }
        where[Op.or] = { toId: wallet.address, fromId: wallet.address }
      }
      // if (address) { where[Op.or] = { recipientId: address, senderId: address } }
      if (address) { where[Op.or] = { toId: address, fromId: address } }
      if (ids) {
        try {
          const wallets = await db.Wallet.findAll({ where: { id: { [Op.in]: ids } } })
          const addresses = wallets.map(m => m.address)
          //const wallet = wallets[0]
          //const asset = await db.Asset.findByPk(wallet.assetId)
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

    Wallets: async (_, args, context) => {
      console.debug('Wallets', args)
      const { ids, page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      if (!user) { return { list: [], error: true, message: 'You must be logged in', list } }
      const where = { userId: user?.id }
      if (ids) {
        where.id = { [Op.in]: ids }
      }
      console.debug('where', where)
      list = await db.Wallet.findAll({ where })
      // return { Wallets: list, error: false, message: '' }
      return list || []
    },
    Wallet: async (_, args, context) => {
      const { id = null } = args
      console.debug('resolvers.Query.Wallet', id)
      const { user, db } = context
      if (!user) { return { error: true, message: 'You must be logged in', wallet: null } }
      // list = await db.Portfolio.findAll({ where: {} })
      const wallet = await db.Wallet.findOne({ where: { id, userId: user.id } }) // , { include: ['user', 'asset']})
      return { wallet, error: false, message: '' }
    },
  },

  // Portfolio: {
  //   Wallets: async (portfolio, args, context) => {
  //     console.debug('Portfolio.Wallets()', portfolio, args)
  //     const { db } = context
  //     const portfolioId = portfolio.id
  //     const models = await db.Wallet.findAll() //{ where: { portfolioId } })
  //     return models
  //   }
  // },

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
    Wallets: async (portfolio, args, context) => {
      console.debug('Portfolio.Wallets()', portfolio)
      const { user, db } = context
      const model = await db.Portfolio.findByPk(portfolio.id, { include: 'wallets' })
      // console.debug('Portfolio.Wallets', portfolio.id, model)
      return model.wallets
    },
    // balanceHistory: async (portfolio, args, context) => {
    //   console.debug('Portfolio.balanceHistory()', portfolio)
    //   const { user, db } = context
    //   const { ids=[], period=90, granulatity='DAY' } = args
    //   const model = await db.Portfolio.findByPk(portfolio.id, { include: 'wallets' })
    //   const wallets = model.wallets

    //   // unique asset ids
    //   const assetIds = wallets.map(wallet => wallet.assetId).filter((v, i, a) => a.indexOf(v) === i)

    //   const sqlQuery = `
    //     WITH RECURSIVE DateSeries AS (
    //       SELECT CURDATE() - INTERVAL ${period} ${granulatity} as date
    //       UNION ALL
    //       SELECT DATE_ADD(date, INTERVAL 1 ${granulatity}) FROM DateSeries
    //       WHERE date < CURDATE()
    //     )
    //     SELECT 
    //       ds.date as interval_date,
    //       COALESCE(
    //         (SELECT SUM(wb.balance)
    //         FROM wallet_balance wb
    //         WHERE DATE(wb.timestamp) <= ds.date
    //         AND wb.id IN (${ids.join(',')})),
    //         ORDER BY wb.timestamp DESC LIMIT 1),
    //         0
    //       ) as balance
    //     FROM DateSeries ds
    //     ORDER BY interval_date;
    //   `;

    //   const ret = await db.Portfolio.query({ where, order: [['timestamp', 'DESC']], limit })
    //   return ret
    // },
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
    Wallets: async (user, args, context) => {
      const { offset = 0, limit = 100 } = args
      const { db } = context
      // const model = db.User.findByPk(user.id, { include: ['wallets']})
      const list = await db.Wallet.findAll({ where: { userId: user.id} }, { offset, limit })
      return list
    },
    assets: async (user, args, context) => {
      const { offset = 0, limit = 100 } = args
      const { db } = context
      // console.debug('User.assets()', user)
      // const model = db.User.findByPk(user.id, { include: ['wallets']})
      const model = await db.User.findByPk(user.id, { include: ['assets', 'wallets'] })
      // console.debug('model', model)
      // get holdings for each asset
      // console.debug('wallets', model.wallets)
      const balancesP = model.wallets.map(wallet => {
        return resolvers.Wallet.balance(wallet, {}, context)
      })
      var balances = await Promise.all(balancesP)
      console.debug('balances', balances)
      const wallets = balances.map((balance, idx) => { return { currencyCode: model.wallets[idx].currencyCode, balance } })
      console.debug('wallets items', wallets.length)
      var assetBals = wallets.reduce((acc, wallet, aidx) => {
        console.debug('reduce...', aidx, wallet.currencyCode, typeof acc)
        if (Array.isArray(acc)) {
          const idx = acc.findIndex(x => x.currencyCode === wallet.currencyCode)
          if (idx === -1) {
            wallet.balance.free       = BigInt(wallet.balance?.free || 0) || 0n
            wallet.balance.reserved   = BigInt(wallet.balance?.reserved || 0) || 0n
            wallet.balance.miscFrozen = BigInt(wallet.balance?.miscFrozen || 0) || 0n
            wallet.balance.feeFrozen  = BigInt(wallet.balance?.feeFrozen || 0) || 0n
            wallet.balance.pooled     = BigInt(wallet.balance?.pooled || 0) || 0n
            acc.push(wallet)
          } else {
            acc[idx].balance.free       += BigInt(wallet.balance?.free || 0) || 0n
            acc[idx].balance.reserved   += BigInt(wallet.balance?.reserved || 0) || 0n
            acc[idx].balance.miscFrozen += BigInt(wallet.balance?.miscFrozen || 0) || 0n
            acc[idx].balance.feeFrozen  += BigInt(wallet.balance?.feeFrozen || 0) || 0n
            acc[idx].balance.pooled     += BigInt(wallet.balance?.pooled || 0) || 0n
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

  Wallet: {
    balance: async (wallet, args, context) => {
      console.debug('Wallet.balance', wallet.assetId, wallet.id, wallet.address)
      const { user, db } = context
      var ret = { balance: { feeFrozen: 0, free: 0, id: 0, miscFrozen: 0, pooled: 0, reserved: 0 } }
      // var asset = await db.Asset.findByPk(wallet.assetId)
      // var chain = ccChain[wallet.assetId]
      // if (!chain) return {}
      // chain = chain.toLowerCase()
      try {
        if (wallet.assetId === 'dock') {
          // read balance from chain (via api)
          var url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/system/account/${wallet.address}`
          console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret = rest.data.data
          // pooled value
          url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/nominationPools/poolMembersForAccount?accountId=${wallet.address}`
          console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
          // locks
          url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/balances/locks?accountId=${wallet.address}`
          // console.debug('url', url)
          var rest = await axios.get(url)
          if (rest.data) ret.locks = rest.data.locks.map(lock => {
            return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
          }) || []
          // pending pool rewards
          url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/api/call/nominationPoolsApi/pendingRewards?accountId=${wallet.address}`
          // console.debug('url', url)
          var rest = await axios.get(url)
          console.log('rest.data', rest.data)
          if (rest.data) ret.pooledClaimable = rest.data.pendingRewards || 0
          // balance
          ret.balance = ret.free + ret.pooledClaimable + ret.pooled
          ret.id = wallet.id

        } else {
          // read balance from db
          const where = { id: wallet.id }
          const latest = await db.WalletBalance.findAll({ where, order: [['timestamp', 'DESC']], limit: 1 })
          ret = latest[0]
  
        }
      } catch(err) {
        // console.warn('last url', url)
        console.error('error', err.toString())
      }
      return ret
    },

    balanceHistory: async (wallet, args, context) => {
      console.debug('Wallet.balanceHistory', wallet.assetId, wallet.id, wallet.address)
      const { user, db } = context
      const { fromBlock, fromDate, limit = 50 } = args
      const where = { id: wallet.id }
      if (fromBlock) where.blockNumber = { [Op.gte]: fromBlock }
      if (fromDate) where.timestamp = { [Op.gte]: fromDate }
      const ret = await db.WalletBalance.findAll({ where, order: [['timestamp', 'DESC']], limit })
      return ret
    },
    /**
     * @param {*} wallet 
     * @param {*} args { t_curr: String, period: String, granulatity: String }
     * @returns array of { date, closing_balance, closing_price }
     */
    valueHistory: async (wallet, args, context) => {
      console.debug('Wallet.valueHistory()', wallet.id)
      const { user, db } = context
      const { t_curr='GBP', periods=30, granulatity='DAY' } = args

      const asset = await db.Asset.findByPk(wallet.assetId)

      const sqlQuery = `
        WITH RECURSIVE DateSeries AS (
          SELECT CURDATE() - INTERVAL ${periods} ${granulatity} as 'datetime'
          UNION ALL
          SELECT DATE_ADD(datetime, INTERVAL 1 ${granulatity}) FROM DateSeries
          WHERE datetime < CURDATE()
        )
        SELECT 
          ds.datetime as 'datetime',
          COALESCE(
            (SELECT wb.balance
            FROM subledgr_dev.wallet_balance wb
            WHERE DATE(wb.timestamp) <= ds.datetime
            AND wb.id = "${wallet.id}"
            ORDER BY wb.timestamp DESC LIMIT 1),
            0
          ) as closing_balance,
          COALESCE(
            (SELECT p.value
            FROM subledgr_dev.price p
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
      console.debug('ret', ret)
      return ret[0]
    },
    User: async (wallet, args, context) => {
      const { user, db } = context
      const _user = await db.User.findByPk(wallet.userId)
      return _user
    },
    Asset: async (wallet, args, context) => {
      const { user, db } = context
      const asset = await db.Asset.findByPk(wallet.assetId)
      return asset
    },
    // Currency: async (wallet, args, context) => {
    //   const { user, db } = context
    //   const _curr = await db.Currency.findByPk(wallet.currencyCode)
    //   return _curr
    // },
    portfolios: async (wallet, args, context) => {
      const { user, db } = context
      console.debug('Wallet.portfolios()', wallet.id)
      const w = await db.Wallet.findByPk(wallet.id, { include: ['portfolios']})
      console.debug('wallet', w)
      // const pids = await db.PortfolioWallet.find({ where: { walletId: wallet.id } });
      // const portfolios = await db.Portfolio.find({ where: { id: { [Op.in]: pids } } })
      return w.portfolios
    },
    transactions: async (wallet, args, context) => {
      // map chainId to polka-store
      // const polkaMap = {
      //   'polkadot': 'Polkadot',
      //   'kusama': 'Kusama',
      //   'dock': 'Dock PoS Mainnet',
      // }
      console.debug('Wallet.transactions()', wallet.assetId, wallet.address)
      const { user, db } = context
      const { limit=50 } = args
      // var asset = await db.Asset.findByPk(wallet.assetId)
      
      const _receipts = await db.Transaction.findAll({ where: {
        // chainId: polkaMap[wallet.assetId],
        chainId: wallet.assetId.toLowerCase(), // Polkadot => polkadot
        toId: wallet.address
      }})
      console.debug('Wallet.transactions() _receipts', _receipts.length)
      const _payments = await db.Transaction.findAll({
        order: [ ['timestamp', 'DESC'] ],
        where: {
          // chainId: polkaMap[wallet.assetId],
          chainId: wallet.assetId.toLowerCase(),
          // senderId: wallet.address,
          fromId: wallet.address,
          // type: {[Op.like]: 'balance%' },
        }
      })
      console.debug('Wallet.transactions() _payments', _payments.length)
      return [..._receipts, ..._payments]
        // .map((m) => {
        //   console.debug('timestamp', m.timestamp)
        //   m.timestamp = m.timestamp
        //   return m
        // })
        .sort((a, b) => {
        // if(Number(a.height) > Number(b.height)) return -1
        // if(Number(a.height) < Number(b.height)) return 1
        if(Number(a.blockNumber) > Number(b.blockNumber)) return -1
        if(Number(a.blockNumber) < Number(b.blockNumber)) return 1
        return 0
      }).slice(0, limit)
    },
    extrinsics: async (wallet, args, context) => {
      console.debug('Wallet.extrinsics()', wallet.currencyCode,ccChain[wallet.currencyCode].toLowerCase())
      // const subscan = new SubscanAPI({ apiKey: secrets.subscan.apiKey, chainId: ccChain[wallet.currencyCode].toLowerCase() })
      const subscan = new SubscanAPI({ apiKey: cr.readEnv('SUBSCAN_API_KEY', 'secrets.subscan.apiKey'), chainId: ccChain[wallet.currencyCode].toLowerCase() })
      var row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success = undefined
      address = wallet.address
      const extrinsicsResponse = await subscan.scan.extrinsics(row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success)
      return extrinsicsResponse
    },
    chartData: async (wallet, args, context) => {
      // let periodicity = {
      //   D: { window: '24 hours', interval: 'hour', datePart: 'hour' },
      //   W: { window: '7 days',   interval: 'day',  datePart: 'day' },
      //   M: { window: '1 month',  interval: 'day',  datePart: 'day' },
      //   Q: { window: '3 months', interval: 'week', datePart: 'week' }
      // }
      // const { user, db } = context
      // const { period = 'D' } = args
      // const { window, interval, datePart } = periodicity[period]
      // let chain = ccChain[wallet.currencyCode]
      // let denom = ccDenom[wallet.currencyCode]
      // let sql = `WITH movements as (
      //   SELECT
      //     date_trunc('${datePart}', to_timestamp("timestamp" / 1000) ) AS "period",
      //     SUM(amount/${denom}) AS movement
      //   FROM transactions
      //   WHERE chain = '${chain}'
      //   AND ( recipientid = '${wallet.address}' 
      //         OR "senderId" = '${wallet.address}' )
      //   AND to_timestamp("timestamp" / 1000) >= cast( date_trunc('${datePart}', NOW() - INTERVAL '${window}') as timestamp)
      //   AND to_timestamp("timestamp" / 1000) < cast( date_trunc('${datePart}', NOW()) as timestamp)
      //   GROUP BY "period"       
      //  	UNION
      //   SELECT
      //     date_trunc('${datePart}', to_timestamp("timestamp" / 1000) ) AS "period",
      //     SUM(coalesce(amount/${denom} * -1, 0)) AS movement
      //   FROM transactions
      //   WHERE chain = '${chain}'
      //   AND ( recipientid = '${wallet.address}'
      //         OR "senderId" = '${wallet.address}' )
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

  Mutation: {
    register: async (_, { email, password }, { db }) => {
      // const user = await createUser(email, password);
      var user = await db.User.findOne({ where: { email }})
      var success = false
      if (!user) {
        success = true,
        user = await db.User.create({email, password});
      }
      const token = db.User.generateToken(user);
      user.token = token
      return { success, message: `User ${success ? 'registration ok' : 'exists'}`, id: user.id, email: user.email, token };
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
      if (!user) {
        // throw new AuthenticationError('Invalid email or password');
        return { success: false, message: 'Invalid email or token', id: 0, email: email }
      }
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
          subject: 'Subledgr Password Reset',
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
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
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
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
      const { name, currencyCode } = args
      console.debug('createPortfolio', args)
      // check currency
      const currency = await db.Currency.findOne({ where: { code: currencyCode } })
      if (!currency) throw new Error(`Invalid currency code ${currencyCode}`)
      // check wallet exists?
      var [portfolio, created] = await db.Portfolio.findOrCreate({ where: { name, currencyCode, userId: user.id } })
      return { success: created, message: `Portfolio ${created ? 'created' : 'retrieved'}`, portfolio }
    },
    setPortfolioWallets: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
      // Find or create wallets based on walletIds
      const { id, walletIds } = args
      const portfolio = await db.Portfolio.findByPk(id)
      if (!portfolio) throw new Error(`Invalid portfolio id ${id}`)
      try {
        const wallets = await Promise.all(
          walletIds.map(async (walletId) => {
            const [wallet, created] = await db.Wallet.findOrCreate({
              where: { id: walletId, userId: user.id }, // Put additional conditions if any
            });
            return wallet;
          })
        );
        if (!wallets.length) throw new Error('No wallets found');
        // Associate wallets with the portfolio
        await portfolio.setWallets(wallets);
        return { success: true, message: `Portfolio ${id} updated`, portfolio }
          
      } catch (err) {
        console.error(err)
        return { success: false, message: `Portfolio ${id} not updated`, portfolio }
      }
    },
    createWallet: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
      const { name, assetId, address } = args
      console.debug('createWallet', args)
      // check currency
      const asset = await db.Asset.findOne({ where: { id: assetId } })
      if (!asset) throw new Error(`Invalid asset id ${assetId}`)
      // check wallet exists?
      var [wallet, created] = await db.Wallet.findOrCreate({ where: { name, assetId, address, userId: user.id } })
      // const wallet = await db.Wallet.create({ name, currencyId: curr.id, address, userId: user.id })
      return { success: created, message: `Wallet ${created ? 'created' : 'retrieved'}`, wallet }
    },
    deleteWallet: async (parent, args, context) => {
      console.debug('deleteWallet', parent, args)
      const { user, db } = context
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
      const { id } = args
      // // check currency
      // const curr = await db.Currency.findOne({ where: { code: currencyCode } })
      // if (!curr) throw new Error(`Invalid currency code ${currencyCode}`)
      // check wallet exists?
      var wallet = await db.Wallet.findOne({ where: { id, userId: user.id }})
      if (!wallet) throw new Error(`Invalid wallet ${id}`)
      const ret = await wallet.destroy()
      // const ret = db.Wallet.destroy({ where: { id, userId: user.id } })
      console.debug('deleteWallet - destroy', ret)
      return { success: true, message: `Wallet deleted` }
    },
  },
};

export { resolvers }
