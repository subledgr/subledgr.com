import { gql } from 'graphql-tag'

export const QUERY_WALLETS = gql`
  query WalletsQuery($ids: [String], $tCurr: String, $page: Int, $offset: Int, $search: String) {
    Wallets(page: $page, offset: $offset, search: $search) {
      id
      name
      address
      Asset {
        id
        code
      }
      # balance {
      #   id
      #   free
      #   reserved
      #   miscFrozen
      #   feeFrozen
      #   pooled
      #   pooledClaimable
      # }
      balance {
        id
        blockNumber
        timestamp
        free
        reserved
        pooled
        claimable
        locked
        balance
        createdAt
        updatedAt
      }
    }
    Prices(ids: $ids, t_curr: $tCurr) {
      datetime
      f_curr
      t_curr
      value
    }
  }
`

export const QUERY_WALLET = gql`
  query Wallet($walletId: String!) {
    Wallet(id: $walletId) {
      wallet {
        id
        name
        address
        Asset {
          id
        }
      }
      error
      message
    }
  }
`

export const QUERY_WALLET_BALANCE = gql`
query WalletBalance($walletId: String!) {
  Wallet(id: $walletId) {
    wallet {
      id
      name
      address
      Asset {
        code
        id
        name
      }
      # balance {
      #   id
      #   locks {
      #     id
      #     amount
      #     reasons
      #   }
      # }
      balanceHistory(limit: 1)  {
        id
        blockNumber
        timestamp
        free
        reserved
        pooled
        claimable
        locked
        balance
        createdAt
        updatedAt
      }
    }
  }
}
`

export const QUERY_WALLET_DETAILS = gql`
query WalletView($walletId: String!) {
  Wallet(id: $walletId) {
    wallet {
      id
      name
      address
      Asset {
        id
      }
      # portfolios {
      #   id
      #   name
      # }
      balance {
        id
        free
        reserved
        miscFrozen
        feeFrozen
        pooled
        pooledClaimable
        locks {
          id
          amount
          reasons
        }
      }
    }
    error
    message
  }
}
`

export const QUERY_WALLET_TRANSACTIONS = gql`
  query WalletView($walletId: String!, $limit: Int) {
    Wallet(id: $walletId) {
      wallet {
        id
        address
        Asset {
          id
          name
          code
          symbol
          decimals
        }
        transactions(limit: $limit) {
          chainId
          Asset {
            id
            code
            name
          }
          id
          blockNumber
          extrinsicId
          extrinsicHash
          section
          method
          # addData
          timestamp
          # specVersion
          # transactionVersion
          # authorId
          fromId
          toId
          amount
          # totalFee
          # feeBalances
          # feeTreasury
          fee
          # tip
          # success
          # updatedAt
          # createdAt
        }
      }
      error
      message
    }
  }
`

export const QUERY_WALLET_VALUE_HISTORY = gql`
query WalletValueHistory($walletId: String!, $tCurr: String, $periods: Int, $granulatity: String) {
  Wallet(id: $walletId) {
    wallet {
      id
      name
      Asset {
        id
        name
        code
      }
      valueHistory(t_curr: $tCurr, periods: $periods, granulatity: $granulatity) {
        datetime
        closing_balance
        closing_price
      }
    }
  }
}`

export const QUERY_WALLET_CHART = gql`
  query WalletChart($id: String!, $interval: String) {
    Wallet {
      chartData {
        period
        value
      }
    }
  }
`
