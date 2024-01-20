'use strict';

// import fs, { readFileSync } from 'fs';
// import path from 'path';
import Sequelize from 'sequelize';
// import process from 'process';
// const { jwt } = pkg
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const basename = path.basename(__filename);
// console.debug('__dirname', __dirname)
// const env = process.env.NODE_ENV || 'development';
// console.debug('env', env)
// const config = JSON.parse(readFileSync(__dirname + '/../config/config.json', 'utf-8'))[env]
// import config from '../../config/config.js'
import { ConfigReader } from '../../config/config-reader.js'

// import { IndexDbFactory } from '../lib/utils.js'
// const idbf = new IndexDbFactory(['polkadot', 'kusama'])

const cr = new ConfigReader()
const config = cr.getConfig()

const db = {};

console.debug(config.db)
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options)
const indexDb = new Sequelize(config.indexDb.database, config.indexDb.username, config.indexDb.password, config.indexDb.options)

import { userModel } from './user.js'
import { assetModel } from './asset.js'
import { currencyModel } from './currency.js'
import { walletModel } from './wallet.js'
import { walletBalanceModel } from './wallet-balance.js'
import { portfolioModel } from './portfolio.js'
import { priceModel } from './price.js'
import { profileModel } from './profile.js'
import { transactionModel } from './transaction.js'

// from defaultDb
// const User = sequelize.define('user', userModel.definition, { ...userModel.options, sequelize })
// The User Class has methods, so we instantiate it differently
const User = userModel.User.init(userModel.definition, { ...userModel.options, sequelize })
const Asset = sequelize.define('asset', assetModel.definition, { ...assetModel.options, sequelize })
const Currency = sequelize.define('currency', currencyModel.definition, { ...currencyModel.options, sequelize })
const Profile = sequelize.define('profile', profileModel.definition, { ...profileModel.options, sequelize })
const Wallet = sequelize.define('wallet', walletModel.definition, { ...walletModel.options, sequelize })
const WalletBalance = sequelize.define('wallet_balance', walletBalanceModel.definition, { ...walletBalanceModel.options, sequelize })
const Portfolio = sequelize.define('portfolio', portfolioModel.definition, { ...portfolioModel.options, sequelize })
const Price = sequelize.define('price', priceModel.definition, { ...priceModel.options, sequelize })
// from indexDb
const Transaction = indexDb.define('transaction', transactionModel.definition, { ...transactionModel.options, sequelize: indexDb })

User.hasOne(Profile, { as: 'profile', foreignKey: 'id' })
User.hasMany(Portfolio, { as: 'portfolios', foreignKey: 'userId' })
User.hasMany(Wallet, { as: 'wallets', foreignKey: 'userId' })

Asset.hasMany(Wallet, { as: 'wallets', foreignKey: 'assetId' })
// Asset.hasMany(Portfolio, { as: 'portfolios', foreignKey: 'assetId' })
// Asset.hasMany(Price, { as: 'prices', foreignKey: 'f_curr' })

Wallet.belongsTo(Asset, { as: 'asset' })
Wallet.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Wallet.belongsToMany(Portfolio, { as: 'portfolios', through: 'portfolio_wallet', foreignKey: 'walletId', otherKey: 'portfolioId'  })
Wallet.hasMany(Transaction, { as: 'receipts', foreignKey: 'toId' })
Wallet.hasMany(Transaction, { as: 'payments', foreignKey: 'fromId' })
Wallet.hasMany(WalletBalance, { as: 'balanceHistory', foreignKey: 'id' })

// Portfolio.belongsTo(Asset, { as: 'asset' })
Portfolio.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Portfolio.belongsToMany(Wallet, { as: 'wallets', through: 'portfolio_wallet', foreignKey: 'portfolioId', otherKey: 'walletId' })

User.belongsToMany(Asset, { as: 'assets', through: 'user_asset', foreignKey: 'userId', otherKey: 'code' })

// Portfolio.prototype.getComputedValue = async function () {
//   console.debug('getComputedValue: portfolio', this.id)
//   // Get the user associated with this portfolio
//   const user = await this.getUser();

//   // Get the profile associated with this user to get the defaultCurrency
//   const profile = await user.getProfile();
//   const defaultCurrency = profile.defaultCurrency;

//   var computedValue = 0;
//   const wallets = await this.getWallets();
//   // console.debug('getComputedValue: wallets', wallets)
//   for (const wallet of wallets) {
//   // wallets.reduce(async (computedValue, wallet) => {
//     const asset = await wallet.getAsset();
//     console.debug('getComputedValue: asset', asset.code)
//     const decimals = asset.decimals;
//     // Fetch the latest price for this asset
//     // This part depends on how you've structured your price model and how prices are stored.
//     const priceModel = await Price.findOne({
//       where: {
//         // conditions to get the latest price for this asset
//         f_curr: asset.code,
//         t_curr: defaultCurrency,
//       },
//       order: [['datetime', 'DESC']]
//     });
//     const latestPrice = priceModel.value;
//     console.debug('getComputedValue: latestPrice', latestPrice)

//     // Compute the final value
//     const factor = Math.pow(10, decimals);
//     const walletValue = wallet.balance / factor * latestPrice;
//     console.debug('getComputedValue: walletValue', walletValue)
//     computedValue += walletValue;
//   }
//   console.debug('getComputedValue: computedValue', computedValue)
//   return computedValue;
// }

// FIXME / TODO should we do this in production?
if (process.env.NODE_ENV === 'development') {
  sequelize.sync()
}

db.User = User
db.Profile = Profile
db.Asset = Asset
db.Currency = Currency
db.Portfolio = Portfolio
db.Wallet = Wallet
db.WalletBalance = WalletBalance
db.Price = Price
db.Transaction = Transaction
db.sequelize = sequelize
db.indexDb = indexDb

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db }
