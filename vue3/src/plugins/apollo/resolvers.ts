// client resolvers!!
import { Cache } from '@apollo/client/cache'
import { InMemoryCache } from '@vue/apollo-components'
import { gql } from '@apollo/client/core'

type T = typeof InMemoryCache
interface IContext {
  cache: T
}

const WRITE_QUERY_USER = gql`
  query WriteUser {
    user {
      id
      email
    }
  }
`

const localUserQuery = gql`
  query LocalUser {
    User @client {
      id
      email
    }
  }
`

const resolvers = {
  Query: {
    Counter: ({}, {}, { client }: any) => {
      console.debug('inside local resolver for Counter')
      return client
       .query({ query: localUserQuery })
       .then(({ data }: any) => {
        console.debug('inside client resolver User()', data)
        return data.user
       })

    },
    User: ({}, {}, { client }: any) => {
      console.debug('inside local resolver for User')
      return client
       .query({ query: localUserQuery })
       .then(({ data }: any) => {
        console.debug('inside client resolver User()', data)
        return data.user
       })
    },
    // Currencies: (_: any, __: any, ) => {
    //   return [
    //     { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: -1, decimals: '2' }
    //   ]
    // }
  },
  Mutation: {
    logout: (parent: any, args: any, { cache }: IContext) => {
      console.log('client logout', parent, args, cache)
      // var cache: Cache
      // var { cache: Cache } = context
      cache.reset()
      // cache.writeQuery({
      //   query: WRITE_QUERY_USER,
      //   data: {
      //     user: {
      //       __typename: 'User',
      //       id: 0,
      //       email: 'empty',
      //     }
      //   }
      // })
      
      return { success: true }
    },
    testMut: () => {
      return 'hello'
    }
  }
}

export { resolvers }
