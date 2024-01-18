import gql from 'graphql-tag'

export const QUERY_PORTFOLIO_VIEW = gql`
query PortfolioView($portfolioId: Int, $ids: [String!], $tCurr: String!) {
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
    Wallets {
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

export const QUERY_PORTFOLIO_WALLETS = gql`
query PortfolioWallets($portfolioId: Int, $ids: [String!], $tCurr: String!) {
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
    Wallets {
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
query PortfolioHistory($portfolioId: Int, $ids: [String!], $tCurr: String!) {
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
    Wallets {
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
mutation SavePortfolio($id: Int!, $name: String!) {
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
mutation DeletePortfolio($id: Int!) {
  deletePortfolio(id: $id) {
    success
    message
  }
}
`
