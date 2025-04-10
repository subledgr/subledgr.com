import { gql } from 'graphql-tag'

export const QUERY_ACCOUNTS_SELECT = gql`
  query AccountsSelect {
    Accounts {
      id
      name
      address
      Asset {
        id
        name
        code
      }
    }
  }
`

export const QUERY_ACCOUNTS = gql`
  query AccountsQuery($ids: [String], $assetId: String, $priceIds: [String], $tCurr: String, $page: Int, $offset: Int, $search: String) {
    Accounts(ids: $ids, assetId: $assetId, page: $page, offset: $offset, search: $search) {
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
        # createdAt
        # updatedAt
      }
    }
    Prices(ids: $priceIds, t_curr: $tCurr) {
      datetime
      f_curr
      t_curr
      value
    }
  }
`

export const QUERY_ACCOUNT = gql`
  query Account($accountId: String!) {
    Account(id: $accountId) {
      # account {
      id
      name
      address
      Asset {
        id
      }
      # }
      # error
      # message
    }
  }
`

export const QUERY_ACCOUNT_BALANCE = gql`
query AccountBalance($accountId: String!) {
  Account(id: $accountId) {
    # account {
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
    # }
  }
}
`

export const QUERY_ACCOUNT_BALANCE1 = gql`
query AccountBalance($accountId: String!) {
  Account(id: $accountId) {
    # account {
      id
      name
      address
      Asset {
        code
        id
        name
      }
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
      }
    # }
  }
}
`

export const QUERY_ACCOUNT_DETAILS = gql`
query AccountViewDetails($accountId: String!) {
  Account(id: $accountId) {
    # account {
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
    # }
    # error
    # message
  }
}
`

export const QUERY_ACCOUNT_IDX_TRANSACTIONS = gql`
  query AccountViewTransactions($accountId: String!, $offset: Int, $limit: Int) {
    Account(id: $accountId) {
      # account {
        id
        name
        address
        Asset {
          id
          name
          code
          symbol
          decimals
        }
        transactions(offset: $offset, limit: $limit) {
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
      # }
      # error
      # message
    }
  }
`

export const QUERY_ACCOUNT_VALUE_HISTORY = gql`
query AccountValueHistory($accountId: String!, $tCurr: String, $periods: Int, $granulatity: String) {
  Account(id: $accountId) {
    # account {
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
    # }
  }
}`

export const QUERY_ACCOUNT_CHART = gql`
  query AccountChart($id: String!, $interval: String) {
    Account {
      chartData {
        period
        value
      }
    }
  }
`

export const QUERY_ACCOUNT_PORTFOLIOS = gql`
  query AccountViewPortfolios($accountId: String!) {
    Account(id: $accountId) {
      # account {
        id
        # name
        # address
        # Asset {
        #   id
        # }
        portfolios {
          id
          name
        }
        # balance {
        #   id
        #   free
        #   reserved
        #   miscFrozen
        #   feeFrozen
        #   pooled
        #   locks {
        #     id
        #     amount
        #     reasons
        #   }
        # }
      # }
      # error
      # message
    }
  }
`