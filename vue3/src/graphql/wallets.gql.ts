import { gql } from 'graphql-tag'

export const QUERY_WALLETS = gql`
  query WalletsQuery($ids: [String], $tCurr: String, $page: Int, $offset: Int, $search: String) {
    Wallets(page: $page, offset: $offset, search: $search) {
      id
      name
      address
      Currency {
        code
      }
      balance {
        id
        free
        reserved
        miscFrozen
        feeFrozen
        pooled
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
