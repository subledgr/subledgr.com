import { gql } from 'graphql-tag'

export const QUERY_PROFILE = gql`
query Profile {
  Profile {
    id
    dateTimeFormat
    defaultCurrency
    defaultDecimals
    itemsPerPage
  }
}
`
