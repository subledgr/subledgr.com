
// import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const QUERY_CURRENCIES = gql`
  query Query {
    Currencies {
      code
      id
      name
    }
  }
`
