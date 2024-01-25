
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client/core'
// import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloProvider } from '@vue/apollo-option'
import { store } from '@/store'
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

// debugging
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

// import { gql } from '@apollo/client/core'
import { resolvers } from './resolvers'
import { typeDefs } from './type-defs'
import { ITransaction } from '@/components/types';
import { __DEV__ } from '@apollo/client/utilities/globals';

if(process.env.NODE_ENV == 'development') {
  loadDevMessages()
  loadErrorMessages()
}

// Create the apollo client
// https://v4.apollo.vuejs.org/guide-advanced/ssr.html#create-apollo-client
function createApolloClient (ssr = false) {

  // console.debug(window.location)
  const httpLink = new HttpLink({
    // You should use an absolute URL here
    // uri: 'http://localhost:4000/graphql', // TODO param this!
    uri: '/graphql', // TODO do we need to param this?
    // credentials: 'include', // this should send the Bearer token...? but breaks CORS?
  })

  const cache = new InMemoryCache({
    typePolicies: {
      AccountData: {
        keyFields: ['id']
      },
      Asset: {
        keyFields: ['id']
      },
      Currency: {
        keyFields: ['code']
      },
      Account: {
        keyFields: ['id'],
      //   fields: {
      //     id: {}
      //   }
        fields: {
          transactions: {
            merge(existing: ITransaction[] = [], incoming: ITransaction[] = [], { readField }) {
              // console.debug('merge', existing, incoming)
              // const transactions = existing ? [...existing] : [];
              // const incomingIds = new Set(incoming.map(t => t.id));
              // transactions.forEach(t => incomingIds.add(t.id));
              // incomingIds.forEach(id => {
              //   if (!transactions.some(t => t.id === id)) {
              //     transactions.push(incoming.find(t => t.id === id) || {} as ITransaction);
              //   }
              // });
              // Create a map for existing transactions with composite keys
              const existingMap = new Map(
                existing.map((ref: any) => {
                  const id = readField('id', ref);
                  const chainId = readField('chainId', ref);
                  return [`${chainId}:${id}`, ref];
                })
              );

              // Create a map for incoming transactions with composite keys
              const incomingMap = new Map(
                incoming.map((transaction: any) => {
                  const id = readField('id', transaction);
                  const chainId = readField('chainId', transaction);
                  return [`${chainId}:${id}`, transaction];
                })
              );

              // Merge existing and incoming transactions
              incomingMap.forEach((value, key) => {
                if (!existingMap.has(key)) {
                  existingMap.set(key, value);
                }
              });

              const merged = Array.from(existingMap.values());

              // console.debug('merge', merged)
              return merged;
            }
          }
        }
      },
      AccountBalance: {
        keyFields: ['id', 'blockNumber']
      },
      Portfolio: {
        keyFields: ['id']
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
        keyFields: ['chainId', 'id'],
        // fields: {
        //   id: {
        //     read (transaction, { readField }) {
        //       return `${readField('chain', transaction)}:${readField('id', transaction)}`;
        //     }
        //   }
        // }
      }
    }
  })

  if (ssr) {
    // we are on the server
    console.log('plugins/apollo/index.ts: server: hello from ssr...!')
  } else {
    // If on the client, recover & injected state from browser
    // console.log('plugins/apollo/index.ts: client: hello from ssr...!')
    persistCacheSync({
      debug: true,
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    });
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
  // indexDB: 
})
