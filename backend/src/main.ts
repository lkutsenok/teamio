import express from 'express';
import {ApolloServer} from "apollo-server-express";
import webhook from './restContollers/webhook'
import schema from './shema'

const Sentry = require('@sentry/node');

require('./mongoConfig');
require('./config/configPassport');

Sentry.init({ dsn: process.env.SENTRY_DSN });

const port = 5500;
const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use('/rest/webhook', webhook);
app.use(Sentry.Handlers.errorHandler());

const server = new ApolloServer({
    schema,
    context: ({req,res}) => {
        return {req, res};
    },
});

server.applyMiddleware({app});
app.listen({port}, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);
