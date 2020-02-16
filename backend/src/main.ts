import express from 'express';
import {ApolloServer} from "apollo-server-express";
import webhook from './restContollers/webhook'
import schema from './shema'


require('./mongoConfig');

const port = 5500;
const app = express();

app.use('/rest/webhook', webhook);

const server = new ApolloServer({schema});

server.applyMiddleware({app});
app.listen({port}, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);