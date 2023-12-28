import gql from 'graphql-tag'

const typeDefs = gql`

type Query {
  User: User
  Assets: [Asset]
  #Currencies: [Currency]
  Counter: Int
  Wallets(page: Int, offset: Int, search: String): WalletsResponse
}

type AccountData {
  id: String
  free: BigInt
  reserved: BigInt
  miscFrozen: BigInt
  feeFrozen: BigInt
  pooled: BigInt
}

type Asset {
  id: String!
  name: String
  symbol: String
  symbolPosition: Int
  decimals: Int
}

#type Currency {
#  code: String!
#  symbol: String
#  name: String
#  symbolPosition: Int
#  decimals: Int
#}

type User {
  id: Int
  email: String
}

type LogoutResponse {
  success: Boolean
}

type Wallet {
  id: String!
  User: User
  Asset: Asset
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

type Mutation {
  logout: LogoutResponse
  testMut: String # @client
}

# type Transaction {}

`

export { typeDefs }
