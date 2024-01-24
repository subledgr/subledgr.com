import { gql } from 'graphql-tag'

export const QUERY_PRICE = gql`
  query PriceQuery($fCurr: String, $tCurr: String) {
    Price(f_curr: $fCurr, t_curr: $tCurr) {
      datetime
      f_curr
      t_curr
      value
    }
  }
`

export const QUERY_PRICES = gql`
  query PricesQuery($ids: [String], $tCurr: String) {
    Prices(ids: $ids, t_curr: $tCurr) {
      datetime
      f_curr
      t_curr
      value
    }
  }
`

export const QUERY_PRICE_HISTORY = gql`
query PriceHistoryQuery($fCurr: String, $tCurr: String) {
  PriceHistory(f_curr: $fCurr, t_curr: $tCurr) {
    key
    price
    f_curr
    t_curr
  }
}
`
