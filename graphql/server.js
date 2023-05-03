'use strict';

// import * as dotenv from 'dotenv'
// dotenv.config()
import './dotenv.js'

import fs from 'fs'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import jwt from 'jsonwebtoken';
import { typeDefs } from './lib/typeDefs.graphql.js';
import { resolvers } from './lib/resolvers.js';
import { db } from './models/index.js'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'SECRET_KEY'

// handle running in docker...
function shutdown(signal) {
  return (err) => {
    console.log(`${ signal }...`);
    if (err) console.error(err.stack || err);
    setTimeout(() => {
      console.log('...waited 5s, exiting.');
      process.exit(err ? 1 : 0);
    }, 5000).unref();
  };
}

// handle crtl-c
process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

async function getUserFromToken(token) {
  // console.debug('getUserFromToken', token)
  if (token === '') return null
  try {
    token = token.split(' ')[1]
    console.debug('getUserFromToken', token)
    const { userId } = jwt.verify(token, JWT_SECRET_KEY);
    console.debug('userId', userId)
    const user = await db.User.findOne({ where: { id: userId } }) //.then((user) => {
    if (!user) console.log('we have no user for', userId)
    return user
    // })
  } catch (error) {
    console.debug(error)
    return null;
  }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
;(async () => {

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  console.log(`Package ${pkg.name} version ${pkg.version}`)

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // this runs for each query! keep it light...
      // console.debug('context firing...', req)
      const token = req.headers.authorization || '';
      const user = await getUserFromToken(token);
      return { token, user, db };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
  
})()

