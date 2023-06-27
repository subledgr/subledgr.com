import gql from 'graphql-tag'
import BigInt from 'graphql-type-bigint'

const typeDefs = gql`
extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])
scalar BigInt

type Query {
  me: User
  UserByEmail(email: String): User
  UserById(id: Int): User
  Users: [User]
  Currencies: [Currency]
  CryptoCurrencies: [CryptoCurrencyCoinbase]
  MarketData(fromCurrency: String, toCurrency: String, fromDate: String, interval: String, periods: Int): [Price]
  Portfolios(page: Int, offset: Int, search: String): [Portfolio]
  Portfolio(id: Int): Portfolio
  Price(f_curr: String, t_curr: String): Price
  Prices(ids: [String], t_curr: String): [Price]
  Profile: UserProfile
  SymbolPriceTicker(symbol: String): SymbolPriceTicker
  Transactions(chainId: String, walletId: String, address: String, ids: [String], offset: Int, limit: Int): [Transaction]
  Wallets(page: Int, offset: Int, search: String): [Wallet] # WalletsResponse
  Wallet(id: String!): WalletResponse
  # books: [Book]
}

type Mutation {
  register(email: String, password: String): UserRegisterResponse
  login(email: String, password: String): UserLoginResponse
  saveProfile(dateTimeFormat: String, defaultCurrency: String, defaultDecimals: Int, itemsPerPage: Int): UserProfile
  reset(token: String, email: String!, password: String): UserResetResponse
  createWallet(name: String!, currencyCode: String!, address: String!): CreateWalletResponse
  deleteWallet(id: String!): DeleteWalletResponse
  addAsset(currencyCode: String): AddAssetResponse
#  addBook(title: String, author: String): AddBookMutationResponse
}

#type MeRseponse extends User {
#  profile: UserProfile
#}

type AccountData 
@key(fields: "id")
{
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
  profile: UserProfile
}
type UserResetResponse {
  success: Boolean!
  message: String!
  id: Int
  email: String
}

type AddAssetResponse {
  success: Boolean!
  message: String!
  currency: Currency
  #added: any
}

type Currency
@key(fields: "code")
{
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

type Price
#@key(fields: ["datetime", "f_curr", "t_curr", "source"])
{
  datetime: String
  f_curr: String
  t_curr: String
  value: Float
  source: String
}

type SymbolPriceTicker {
  symbol: String
  price: Float
}

# type ExchangeRate {
#  base: String
#  quote: String
# }

type Portfolio
@key(fields: "id")
{
  id: Int # TODO: change to String UUID
  User: User
  name: String!
  Currency: Currency
  Wallets: [Wallet]
}

type Transaction 
#@key(fields: ["chain", "id"])
{
  chain: String
  id: String
  height: BigInt
  blockHash: String
  type: String
  subType: String
  event: String
  addData: String
  timestamp: BigInt
  specVersion: String
  transactionVersion: String
  authorId: String
  senderId: String
  recipientid: String
  amount: BigInt
  totalFee: BigInt
  feeBalances: BigInt
  feeTreasury: BigInt
  tip: BigInt
  success: Boolean
  updatedAt: String
  createdAt: String
}

type User 
@key(fields: "id")
{  
  id: Int
  email: String
#  password: String
  token: String
  Wallets: [Wallet]
  portfolios: [Portfolio]
  assets: [AssetBalance]
#  not here! just get this direct from Profile
#  profile: UserProfile
}

type UserProfile
@key(fields: "id")
{
  id: Int
  dateTimeFormat: String
  defaultCurrency: String
  defaultDecimals: Int
  itemsPerPage: Int
}

type Wallet
@key(fields: "id")
{
  id: String!
  User: User
  Currency: Currency
  address: String!
  name: String!
  balance: AccountData
  transactions: [Transaction]
  chartData(period: String): [WalletChartItem]
}

type WalletChartItem {
  period: String
  value: Float
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

type CreateWalletResponse {
  success: Boolean!
  message: String
  wallet: Wallet
}

type DeleteWalletResponse {
  success: Boolean!
  message: String!
}

`

export { typeDefs }
