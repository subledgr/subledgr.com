import gql from 'graphql-tag'

export const QUERY_PORTFOLIO_VIEW = gql`
query PortfolioView($portfolioId: String!, $ids: [String!], $tCurr: String!) {
  Prices(ids: $ids, t_curr: $tCurr) {
    datetime
    f_curr
    t_curr
    value
  }
  Portfolio(id: $portfolioId) {
    id
    name
    # Currency {
    #   code
    # }
    Accounts {
      id
      name
      address
      balance {
        id
        blockNumber
        free
        reserved
        locked
        # miscFrozen
        # feeFrozen
        pooled
        claimable
        balance
      }
      Asset {
        id
        code
      }
    }
  }
}
`

export const QUERY_PORTFOLIO_ACCOUNTS = gql`
query PortfolioAccounts($portfolioId: String!, $ids: [String!], $tCurr: String!) {
  Prices(ids: $ids, t_curr: $tCurr) {
    datetime
    f_curr
    t_curr
    value
  }
  Portfolio(id: $portfolioId) {
    id
    name
    # Currency {
    #   code
    # }
    Accounts {
      id
      name
      address
      balance {
        id
        timestamp
        blockNumber
        free
        reserved
        locked
        # miscFrozen
        # feeFrozen
        pooled
        claimable
      }
      Asset {
        id
        code
      }
    }
  }
}
`

export const QUERY_PORTFOLIO_HISTORY = gql`
query PortFolioHistoryQuery($portfolioId: String!, $periods: Int, $granularity: String) {
  Assets {
    id
    code
    decimals
  }
  Portfolio(id: $portfolioId) {
    id
    name
    balanceHistory(periods: $periods, granularity: $granularity) {
      balanceHistory {
        accountId
        assetId
        balanceHistory {
          datetime
          closing_balance
        }
      }
      priceHistory {
        assetId
        f_curr
        t_curr
        priceHistory {
          datetime
          closing_price
        }
      }
    }
  }
}
`
export const MUT_PORTFOLIO_ADD = gql`
mutation CreatePortfilio($name: String!) {
  createPortfolio(name: $name) {
    success
    message
    portfolio {
      id
      name
      # Currency {
      #   code
      # }
    }
  }
}
`

export const MUT_PORTFOLIO_EDIT = gql`
mutation SavePortfolio($id: String!, $name: String!) {
  savePortfolio(id: $id, name: $name) {
    success
    message
    portfolio {
      id
      name
    }
  }
}
`

export const MUT_PORTFOLIO_DELETE = gql`
mutation DeletePortfolio($id: String!) {
  deletePortfolio(id: $id) {
    success
    message
  }
}
`
