import {ApolloServer} from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import resolvers from './graphql/resolvers';
import {schema} from './graphql/schema/schema';
import {User} from "./models/user";
import config from './config';
import {getUser} from './utils';

console.clear();

const app = express();
app.use(cors());

const server = new ApolloServer({
    debug: false,
    typeDefs: schema,
    resolvers,
    context: async ({req}) => {
        if (req) {
            const me = await getUser(req);

            return {
                me,
                models: {
                    User,
                },
            };
        }
    },
});

server.applyMiddleware({app});

mongoose.connect(config.database, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.info('[✔] Connected to MongoDB');
    app.emit('ready');
});

app.on('ready', () => {
    app.listen({port: config.port}, () =>
        console.info(`[✔] Server ready at http://localhost:${config.port}${server.graphqlPath}`)
    )
});
