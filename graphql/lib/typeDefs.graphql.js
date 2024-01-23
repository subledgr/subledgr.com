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
  Asset(id: String!): Asset
  Assets: [Asset]
  Currencies: [Currency]
  CryptoCurrencies: [CryptoCurrencyCoinbase]
  MarketData(fromCurrency: String, toCurrency: String, fromDate: String, interval: String, periods: Int): [Price]
  Portfolios(page: Int, offset: Int, search: String): [Portfolio]
  Portfolio(id: Int): Portfolio
  Price(f_curr: String, t_curr: String): Price
  Prices(ids: [String], t_curr: String): [Price]
  PriceHistory(f_curr: String, t_curr: String): [PriceHistoryItem]
  Profile: UserProfile
  SymbolPriceTicker(symbol: String): SymbolPriceTicker
  Transactions(chainId: String, walletId: String, address: String, ids: [String], offset: Int, limit: Int): [Transaction]
  Wallets(ids: [String], assetId: String, page: Int, offset: Int, search: String): [Wallet] # WalletsResponse
  Wallet(id: String!): WalletResponse
}

type Mutation {
  register(email: String, password: String): UserRegisterResponse
  login(email: String, password: String): UserLoginResponse
  saveProfile(dateTimeFormat: String, locale: String, defaultCurrency: String, defaultDecimals: Int, itemsPerPage: Int): UserProfile
  reset(token: String, email: String!, password: String): UserResetResponse

  # Portfolio management
  createPortfolio(name: String!): CreatePortfolioResponse
  savePortfolio(id: Int!, name: String!): CreatePortfolioResponse
  deletePortfolio(id: Int!): DeletePortfolioResponse
  setPortfolioWallets(id: Int!, walletIds: [String]!): CreatePortfolioResponse

  # Wallet management
  createWallet(name: String!, assetId: String!, address: String!): CreateWalletResponse
  deleteWallet(id: String!): DeleteWalletResponse

  # Asset management
  addAsset(assetId: String): AddAssetResponse
}

type AccountData 
@key(fields: "id")
{
  id: String
  free: BigInt
  reserved: BigInt
  miscFrozen: BigInt
  feeFrozen: BigInt
  pooled: BigInt
  pooledClaimable: BigInt
  locks: [BalanceLock]
}

type Account {
  nonce: Int
  consumers: Int
  providers: Int
  sufficients: Int
  data: AccountData
}

type AssetBalance {
  assetId: String
  balance: AccountData
}

type BalanceLock {
  id: String
  amount: BigInt
  reasons: String
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
  asset: Asset
  #added: any
}

type Asset
@key(fields: "id")
{
  id: String
  code: String
  type: String
  name: String
  active: Boolean
  parent: String
  decimals: Int
  symbol: String
  symbolPosition: Int
  status: String
  logo: String
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

type Judgement {
  index: Int
  judgement: String
}

type AccountDisplay {
  address: String
  display: String
  judgements: [Judgement]
  account_index: String
  identity: Boolean
  parent: AccountDisplayParent
}
type AccountDisplayParent {
  address: String
  display: String
  sub_symbol: String
  identity: Boolean
}
type Event {
  event_index: String
  block_num: BigInt
  extrinsic_index: Int
  module_id: String
  event_id: String
  params: String
  phase: Int
  event_idx: Int
  extrinsic_hash: String
  finalized: Boolean
  block_timestamp: BigInt
}
type Extrinsic {
  account_display: AccountDisplay
  account_id: String
  account_index: String
  block_num: BigInt
  block_timestamp: BigInt
  call_module: String
  call_module_function: String
  extrinsic_hash: String
  extrinsic_index: String
  fee: BigInt
  fee_used: BigInt
  nonce: Int
  params: String
  signature: String
  from_hex: String
  finalized: Boolean
  success: Boolean
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
  # Currency: Currency # reporting currency
  Wallets: [Wallet]
#  value: Float
}

type PriceHistoryItem {
  f_curr: String
  t_curr: String
  key: String
  price: Float
}

# this comes from indexDb
type Transaction # matched to subsquid Transfer model
#@key(fields: ["chain", "id"])
{
  chainId: String # we will shard the database on chain_id
  Asset: Asset
  id: String
  blockNumber: BigInt
  timestamp: String
  extrinsicId: String
  extrinsicHash: String
  #type: String
  section: String
  #subType: String
  method: String
  #event: String
  #addData: String
  # specVersion: String
  # transactionVersion: String
  #authorId: String
  address: String # this is the account address for a query
  fromId: String
  toId: String
  amount: BigInt
  # totalFee: BigInt
  # feeBalances: BigInt
  # feeTreasury: BigInt
  # tip: BigInt
  fee: BigInt
  success: Boolean
  #updatedAt: String
  #createdAt: String
}

# type Transaction_polka_store
# #@key(fields: ["chain", "id"])
# {
#   chain: String
#   Asset: Asset
#   id: String
#   height: BigInt
#   blockHash: String
#   type: String
#   subType: String
#   event: String
#   addData: String
#   timestamp: BigInt
#   specVersion: String
#   transactionVersion: String
#   authorId: String
#   senderId: String
#   recipientId: String
#   amount: BigInt
#   totalFee: BigInt
#   feeBalances: BigInt
#   feeTreasury: BigInt
#   tip: BigInt
#   success: Boolean
#   updatedAt: String
#   createdAt: String
# }

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
  locale: String
  defaultDecimals: Int
  itemsPerPage: Int
}

type Wallet
@key(fields: "id")
{
  id: String!
  User: User
  # assetId: String
  Asset: Asset
  address: String!
  name: String!
  # balance: AccountData
  balance: WalletBalance
  portfolios: [Portfolio]
  transactions(limit: Int, offset: Int): [Transaction]
  extrinsics: ExtrinsicsResponse
  events: EventsResponse
  chartData(period: String): [WalletChartItem]
  balanceHistory(fromBlock: BigInt, fromDate: String, limit: Int): [WalletBalance]
  valueHistory(t_curr: String, periods: Int, granulatity: String): [WalletValueItem]
}

type WalletBalance
# @key(fields: ["id", "blockNumber"])
{
  id: String
  blockNumber: BigInt
  timestamp: String
  free: BigInt
  reserved: BigInt
  pooled: BigInt
  claimable: BigInt
  locked: BigInt
  balance: BigInt
  createdAt: String
  updatedAt: String
}

type WalletValueItem {
  datetime: String
  closing_balance: BigInt
  closing_price: Float
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

type EventsResponse {
  count: Int
  page: Int
  rows: Int
  events: [Event]
}

type ExtrinsicsResponse {
  count: Int
  page: Int
  rows: Int
  extrinsics: [Extrinsic]
}

type WalletResponse {
  wallet: Wallet
  error: Boolean
  message: String
}

type CreatePortfolioResponse {
  success: Boolean!
  message: String
  portfolio: Portfolio
}
type DeletePortfolioResponse {
  success: Boolean!
  message: String!
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
