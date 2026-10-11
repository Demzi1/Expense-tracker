import {  mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ApolloServer } from "@apollo/server";

import { userTypeDef } from "./typeDefs/user.js";
import { TransactionTypeDefs } from "./typeDefs/transaction.js";
import { userResolver } from "./resolvers/user.js";
import { transactionResolver } from "./resolvers/transaction.js";
import { connectDB } from "./db/connetDB.js";

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv'
import cors from 'cors'

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import {buildContext} from "graphql-passport";
import {configurePassport} from "./passport/config.js"

dotenv.config();
configurePassport();
const app = express();

const httpServer = http.createServer(app);
const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions"
})

store.on("error", (err)=>{console.log(err)});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookies: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    },
    store: store
  })
)

app.use(passport.initialize());
app.use(passport.session());


const mergedResolvers = mergeResolvers([userResolver,transactionResolver]);
const mergedTypeDefs = mergeTypeDefs([TransactionTypeDefs,userTypeDef])
 
const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start();
 
app.use(
  '/graphql',
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res}) => buildContext({ req ,res}),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);