
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloProvider } from '@vue/apollo-option'
import { store } from '@/store'
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

import { gql } from '@apollo/client/core'
import { resolvers } from './resolvers'
import { typeDefs } from './type-defs'

// Create the apollo client
// https://v4.apollo.vuejs.org/guide-advanced/ssr.html#create-apollo-client
function createApolloClient (ssr = false) {

  console.debug(window.location)
  const httpLink = new HttpLink({
    // You should use an absolute URL here
    // uri: 'http://localhost:4000/graphql', // TODO param this!
    uri: '/graphql', // TODO param this!
    // credentials: 'include', // this should send the Bearer token...? but breaks CORS?
  })

  const cache = new InMemoryCache({
    typePolicies: {
      AccountData: {
        keyFields: ['id']
      },
      Currency: {
        keyFields: ['code']
      },
      Wallet: {
        keyFields: ['id']
      //   fields: {
      //     id: {}
      //   }
      },
      Price: {
        keyFields: ['datetime', 'f_curr', 't_curr'],
        // fields: {
        //   id: {
        //     read (price, { readField }) {
        //       return `${readField('f_curr', price)}:${readField('t_curr', price)}:${readField('datetime', price)}`;
        //     }
        //   }
        // },
      },
      Transaction: {
        keyFields: ['chain', 'id']
      }
    }
  })

  if (ssr) {
    // we are on the server
    console.log('server: hello from ssr...!')
  } else {
    // If on the client, recover & injected state from browser

    console.log('client: hello from ssr...!')
    // const state = JSON.parse(localStorage.getItem('subledgr') || '{}')
    // console.debug('got state', state)
    // pre-populate cache - note: beware of SSR!!
    // cache.writeQuery({
    //   query: gql`
    //     mutation Mut {
    //       state
    //     }`,
    //     data: {
    //       state
    //     }
    // })
    // // if (typeof window !== 'undefined') {
    // console.debug(window)
    // const state = window.__APOLLO_STATE__
    // if (state) {
    //   // If you have multiple clients, use `state.<client_id>`
    //   console.debug('ssr, got this from window.__APOLLO_STATE__)', state)
    //   cache.restore(state.defaultClient)
    // } else {
    //   console.debug('well, window.__APOLLO_STATE__ was empty...!')
    // }
    persistCacheSync({
      debug: true,
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    });
    // // }
  }

  // add the authorization to the headers
  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = store.state.token;
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    // console.debug('authMiddleware', token)
    return forward(operation);
  });

  const apolloClient = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    resolvers,
    typeDefs,
    cache,
    connectToDevTools: true,
  })

  return apolloClient  
}

// Create a provider
export const apolloProvider = createApolloProvider({
  defaultClient: createApolloClient(typeof window === 'undefined'),
})
