// import { createUser, findUserByEmail, findUserById, comparePassword } from '../models/user.js';
// import User from '../models/user.js'
import axios from 'axios'
import Binance from 'binance-api-node'
const binance = Binance.default()
import { Op } from 'sequelize';
import { createChainProviders } from './chains/providers.js';
import { secrets } from './secrets.js';
import { Coinbase } from './coinbase-api.js';
import { GraphQLScalarType, Kind } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import mjml2html from 'mjml'
import fs from 'fs'
import path from "path"
const __dirname = path.resolve();
import mustache from 'mustache'
import nodemailer from 'nodemailer'

const cb = new Coinbase({ apiKey: secrets.apiKey, apiSecret: secrets.apiSecret })
const dotsamaRestApiBaseUrl = process.env.DOTSAMA_REST_API_BASE_URL || 'http://localhost:3000'
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
// TODO where should this go?
const ccChain = {
  DOT: 'Polkadot',
  KSM: 'Kusama',
  DOCK: 'Dock'
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}
const requireAuthResponse = { error: true, message: 'You must be authenticated'}

const resolvers = {
  BigInt: new GraphQLScalarType({
    name: 'BigInt',
    description: 'BigInt Scalar Type',
    parseValue (value) { return BigInt(vaalue )},
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
      const me = await db.User.findOne({ where: { id: user.id} }, { include: ['wallets', 'portfolios']});
      return me;
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
      var list = []
      const where = { id }
      
      const model = await db.Portfolio.findOne({ where })
      return model
    },
    Portfolios: async (_, args, context) => {
      const { page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      // if (!user) { return { error: true, message: 'You must be logged in', list } }
      // list = await db.Portfolio.findAll({ where: {} })
      list = await db.Portfolio.findAll({}, { include: ['user', 'wallets']})
      return list
    },
    Price: async (_, args, context) => {
      const { user, db } = context
      const { f_curr, t_curr } = args
      // if (!user) { return { error: true, message: 'You must be logged in', list } }
      const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: 1 })
      return prices[0]
    },
    Prices: async (_, args, context) => {
      const { user, db } = context
      const { ids=[], t_curr } = args
      var result = []
      for (let i = 0; i < ids.length; i++) {
        const f_curr = ids[i]
        const prices = await db.Price.findAll({ where: { f_curr, t_curr }, order: [['datetime', 'DESC']], limit: 1 })
        result.push(prices[0] || { datetime: '', f_curr, t_curr, value: 0})
      }
      return result
    },
    SymbolPriceTicker: async (_, args, context) => {
      const { symbol } = args
      const price = await binance.prices({ symbol })
      console.debug('price', price)
      return { symbol, price: parseFloat(price[symbol]) }
    },

    Transactions: async (_, args, context) => {
      console.debug('Transactions', args)
      const { chainId, walletId, address, ids, offset = 0, limit = 50 } = args
      const { user, db } = context
      const where = {}
      if (walletId) {
        const wallet = await db.Wallet.findByPk(walletId)
        where.chain = ccChain[wallet.currencyCode]
        where[Op.or] = { recipientId: wallet.address, senderId: wallet.address }
      }
      if (address) { where[Op.or] = { recipientId: address, senderId: address } }
      if (ids) { where[Op.or] = { recipientId: { [Op.in]: ids }, senderId: { [Op.in]: ids } } }
      // console.debug(where, offset, limit)
      const order = [['height', 'DESC'], ['id', 'DESC']]
      const list = await db.Transaction.findAll({ where, order, offset, limit })

      console.log('\nreturning', list.length, 'items\n')
      return list || []
    },

    Wallets: async (_, args, context) => {
      const { page = 1, offset = 0, search = '' } = args
      const { user, db } = context
      var list = []
      if (!user) { return { list: [], error: true, message: 'You must be logged in', list } }
      // list = await db.Wallet.findAll({}, { include: ['user']})
      list = await db.Wallet.findAll({ userId: user.id })
      // return { Wallets: list, error: false, message: '' }
      return list || []
    },
    Wallet: async (_, args, context) => {
      const { id = null } = args
      console.debug('resolvers.Query.Wallet', id)
      const { user, db } = context
      if (!user) { return { error: true, message: 'You must be logged in', wallet: null } }
      // list = await db.Portfolio.findAll({ where: {} })
      const wallet = await db.Wallet.findOne({ where: { id, userId: user.id } }, { include: ['user']})
      return { wallet, error: false, message: '' }
    },
  },

  User: {
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
  },

  Portfolio: {
    User: async (portfolio, args, context) => {
      const { user, db } = context
      const _user = await db.User.findByPk(portfolio.userId)
      return _user
    },
    Currency: async (portfolio, args, context) => {
      const { user, db } = context
      const _curr = await db.Currency.findByPk(portfolio.currencyId)
      return _curr
    },
    Wallets: async (portfolio, args, context) => {
      const { user, db } = context
      const model = await db.Portfolio.findByPk(portfolio.id, { include: ['wallets']})
      // console.debug('Portfolio.Wallets', portfolio.id, model)
      return model.wallets
    },
  },

  Currency: {
    // price: async (currency, args, context) => {
    //   const { user, db } = context
    //   const {t_curr } = args
    //   console.debug('Currency.price', currency)
    //   const prices = await db.Price.findAll({ where: { f_curr: currency.code, t_curr }, order: [['datetime', 'DESC']], limit: 1 })
    //   return prices[0]
    // },
  },

  Wallet: {
    balance: async (wallet, args, context) => {
      console.debug('Wallet.balance', wallet.id)
      const { user, db } = context
      var ret = { balance: 0 }
      var chain = undefined
      switch (wallet.currencyCode) {
        case 'DOT':
        case 'dot':
          chain = 'polkadot'
          break
        case 'KSM':
        case 'ksm':
          chain = 'kusama'
          break
        case 'DOCK':
        case 'dock':
          chain = 'dock'
          break
      }
      if (!chain) return {}
      var url = `${dotsamaRestApiBaseUrl}/${chain}/query/system/account/${wallet.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret = rest.data.data
      // pooled value
      url = `${dotsamaRestApiBaseUrl}/${chain}/query/nominationPools/poolMembersForAccount?accountId=${wallet.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
      ret.id = wallet.id
      return ret
    },
    User: async (wallet, args, context) => {
      const { user, db } = context
      const _user = await db.User.findByPk(wallet.userId)
      return _user
    },
    Currency: async (wallet, args, context) => {
      const { user, db } = context
      const _curr = await db.Currency.findByPk(wallet.currencyCode)
      return _curr
    },
    transactions: async (wallet, args, context) => {
      console.debug('Wallet.transactions()', wallet.currencyCode, wallet.address)
      const { user, db } = context
      const _receipts = await db.Transaction.findAll({ where: {
        chain: ccChain[wallet.currencyCode],
        recipientId: wallet.address
      }})
      const _payments = await db.Transaction.findAll({ where: {
        chain: ccChain[wallet.currencyCode],
        senderId: wallet.address
      }})
      return [..._receipts, ..._payments].sort((a, b) => {
        if(Number(a.height) > Number(b.height)) return -1
        if(Number(a.height) < Number(b.height)) return 1
        return 0
      }).slice(0, 50)
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
      const user = await db.User.scope('login').findOne({ where: { email } });
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
      return { success: true, message: 'Login ok', id: user.id, email: user.email, token };
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
      const { currencyCode } = args
      console.debug('addAsset', args)
      const userModel = await db.User.findByPk(user.id, { include: ['assets'] })
      const currModel = await db.Currency.findByPk(currencyCode)
      // console.debug('userModel', userModel)
      const added = await userModel.addAsset(currModel)
      console.debug('added', added)
      return { success: true, message: `Asset ${added ? 'created' : 'retrieved'}`, currency: currModel, added }
    },
    // deleteAsset: async (_, args, context) => {
    //   const { user, db } = context
    //   // check user login
    //   if (!user) throw new AuthenticationError('You must be logged in');
    //   const { currencyCode } = args
    //   console.debug('deleteAsset', args)
    // },
    createWallet: async (_, args, context) => {
      const { user, db } = context
      // check user login
      if (!user) throw new AuthenticationError('You must be logged in');
      const { name, currencyCode, address } = args
      console.debug('createWallet', args)
      // check currency
      const curr = await db.Currency.findOne({ where: { code: currencyCode } })
      if (!curr) throw new Error(`Invalid currency code ${currencyCode}`)
      // check wallet exists?
      var [wallet, created] = await db.Wallet.findOrCreate({ where: { name, currencyCode, address, userId: user.id } })
      // const wallet = await db.Wallet.create({ name, currencyId: curr.id, address, userId: user.id })
      return { success: created, message: `Wallet ${created ? 'created' : 'retrieved'}`, wallet }
    },
    deleteWallet: async (parent, args, context) => {
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
      return { success: ret, message: `Wallet deleted` }
    },
  },
};

export { resolvers }
