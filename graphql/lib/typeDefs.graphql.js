import gql from 'graphql-tag'
import BigInt from 'graphql-type-bigint'

const typeDefs = gql`
scalar BigInt

type Query {
  me: User
  UserByEmail(email: String): User
  UserById(id: Int): User
  Users: [User]
  Currencies: [Currency]
  CryptoCurrencies: [CryptoCurrencyCoinbase]
  Portfolios(page: Int, offset: Int, search: String): [Portfolio]
  Portfolio(id: Int): Portfolio
  Price(f_curr: String, t_curr: String): Price
  Prices(ids: [String], t_curr: String): [Price]
  SymbolPriceTicker(symbol: String): SymbolPriceTicker
  Transactions(walletId: String, address: String, ids: [String], offset: Int, limit: Int): [Transaction]
  Wallets(page: Int, offset: Int, search: String): [Wallet] # WalletsResponse
  Wallet(id: String!): WalletResponse
  # books: [Book]
}

type Mutation {
  register(email: String, password: String): UserRegisterResponse
  login(email: String, password: String): UserLoginResponse
  createWallet(name: String!, currencyCode: String!, address: String!): CreateWalletResponse
  deleteWallet(id: Int!): DeleteWalletResponse
  addAsset(currencyCode: String): AddAssetResponse
  addBook(title: String, author: String): AddBookMutationResponse
}

type User {
  id: Int
  email: String
#  password: String
  token: String
  Wallets: [Wallet]
  portfolios: [Portfolio]
  assets: [AssetBalance]
}

type AccountData {
  id: String
  free: BigInt
  reserved: BigInt
  miscFrozen: BigInt
  feeFrozen: BigInt
  pooled: BigInt
}

type Account {
  nonce: Int
  consumers: Int
  providers: Int
  sufficients: Int
  data: AccountData
}

type AssetBalance {
  currencyCode: String
  balance: AccountData
}

type UserRegisterResponse {
  success: Boolean!
  message: String!
  id: Int
  email: String
}
type UserLoginResponse {
  success: Boolean!
  message: String!
  id: Int
  email: String
  token: String
}

type AddAssetResponse {
  success: Boolean!
  message: String!
  currency: Currency
  #added: any
}

type Currency {
  code: String
  name: String
#  price: Price
}

type CurrencyCoinbase {
  id: String # Coinbase
  name: String
  min_size: String
}

type CryptoCurrencyCoinbase {
  id: Int
  code: String!
  name: String!
  color: String
  sort_index: String
  exponent: Int
  type: String
  address_regex: String
  asset_id: String
}

type Price {
  datetime: String
  f_curr: String
  t_curr: String
  value: Float
}

type SymbolPriceTicker {
  symbol: String
  price: Float
}

# type ExchangeRate {
#  base: String
#  quote: String
# }

type Transaction {
  chain: String
  id: String
  height: BigInt
  blockHash: String
  type: String
  subType: String
  event: String
  addData: String
  timestamp: String
  specVersion: String
  transactionVersion: String
  authorId: String
  senderId: String
  recipientId: String
  amount: BigInt
  totalFee: BigInt
  feeBalances: BigInt
  feeTreasury: BigInt
  tip: BigInt
  success: Boolean
  updatedAt: String
  createdAt: String
}

type Wallet {
  id: String!
  User: User
  Currency: Currency
  address: String!
  name: String!
  balance: AccountData
  transactions: [Transaction]
}

type WalletsResponse {
  Wallets: [Wallet]
  error: Boolean
  message: String
}

type WalletResponse {
  wallet: Wallet
  error: Boolean
  message: String
}

type Book {
  title: String
  author: String
}

type AddBookMutationResponse {
  code: String!
  success: Boolean!
  message: String!
  book: Book
}

type CreateWalletResponse {
  success: Boolean!
  message: String
  wallet: Wallet
}

type DeleteWalletResponse {
  success: Boolean!
  message: String!
}

type Portfolio {
  id: Int
  User: User
  name: String!
  Currency: Currency
  Wallets: [Wallet]
}

`

export { typeDefs }
