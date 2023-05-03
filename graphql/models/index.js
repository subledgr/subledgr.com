'use strict';

import fs, { readFileSync } from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
// const { jwt } = pkg
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
console.debug('__dirname', __dirname)
// const env = process.env.NODE_ENV || 'development';
// console.debug('env', env)
// const config = JSON.parse(readFileSync(__dirname + '/../config/config.json', 'utf-8'))[env]
// import config from '../config/config.js'
import { ConfigReader } from '../config.js'
const cr = new ConfigReader
const config = cr.getConfig()
console.debug(config)

const db = {};

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
console.debug('sequelize', sequelize)

const indexDb = new Sequelize('polkastore', 'postgres', 'thisIsASecret', {
  dialect: "postgres",
  username: 'postgres',
  host:     '192.168.1.77',
  database: 'polkastore',
  password: 'thisIsASecret',
  port:     5433,
})

function generateToken(user) {
  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  console.debug('generateToken:', user.id, token)
  return token;
}
async function comparePassword(password) {
  console.debug('comparePassword', password)
  return bcrypt.compareSync(password, this.password);
}

import { userModel } from './user.js'
import { currencyModel } from './currency.js'
import { walletModel } from './wallet.js'
import { portfolioModel } from './portfolio.js'
import { priceModel } from './price.js';
import { transactionModel } from './transaction.js';

// const User = sequelize.define('user', userModel.definition, { ...userModel.options, sequelize });
const User = userModel.User.init(userModel.definition, { ...userModel.options, sequelize })
// User.prototype.generateToken = generateToken
// User.prototype.comparePassword = comparePassword

const Currency = sequelize.define('currency', currencyModel.definition, { ...currencyModel.options, sequelize });
const Wallet = sequelize.define('wallet', walletModel.definition, { ...walletModel.options, sequelize });
const Portfolio = sequelize.define('portfolio', portfolioModel.definition, { ...portfolioModel.options, sequelize });
const Price = sequelize.define('price', priceModel.definition, { ...priceModel.options, sequelize });
const Transaction = indexDb.define('transaction', transactionModel.definition, { ...transactionModel.options, sequelize: indexDb})

User.hasMany(Portfolio, { as: 'portfolios', foreignKey: 'userId' })
User.hasMany(Wallet, { as: 'wallets', foreignKey: 'userId' })

Currency.hasMany(Wallet, { as: 'wallets', foreignKey: 'currencyCode' })
Currency.hasMany(Portfolio, { as: 'portfolios', foreignKey: 'currencyCode' })
Currency.hasMany(Price, { as: 'prices', foreignKey: 'f_curr' })

Wallet.belongsTo(Currency, { as: 'currency' })
Wallet.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Wallet.belongsToMany(Portfolio, { as: 'portfolios', through: 'portfolio_wallet', foreignKey: 'walletId', otherKey: 'portfolioId'  })
Wallet.hasMany(Transaction, { as: 'receipts', foreignKey: 'recipientId' })
Wallet.hasMany(Transaction, { as: 'payments', foreignKey: 'senderId' })

Portfolio.belongsTo(Currency, { as: 'currency' })
Portfolio.belongsTo(User, { as: 'user', foreignKey: '' })
Portfolio.belongsToMany(Wallet, { as: 'wallets', through: 'portfolio_wallet', foreignKey: 'portfolioId', otherKey: 'walletId' })

User.belongsToMany(Currency, { as: 'assets', through: 'user_asset', foreignKey: 'userId', otherKey: 'code' })

sequelize.sync()

db.User = User
db.Currency = Currency
db.Portfolio = Portfolio
db.Wallet = Wallet
db.Price = Price
db.Transaction = Transaction
db.indexDb = indexDb

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db }
