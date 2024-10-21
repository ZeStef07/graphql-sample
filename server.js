// server.js

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

// Données fictives
let users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Définition du schéma GraphQL
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        addUser(name: String!, email: String!): User
    }
`;

// Résolveurs
const resolvers = {
    Query: {
        users: () => users,
        user: (parent, args) => users.find(user => user.id === args.id),
    },
    Mutation: {
        addUser: (parent, args) => {
            const newUser = {
                id: String(users.length + 1), // générer un nouvel ID
                name: args.name,
                email: args.email,
            };
            users.push(newUser);
            return newUser;
        },
    },
};

// Fonction principale pour démarrer le serveur
const startServer = async () => {
    // Création du serveur Apollo
    const server = new ApolloServer({ typeDefs, resolvers });

    // Démarrer le serveur Apollo
    await server.start();

    // Démarrer l'application Express
    const app = express();

    // Appliquer le middleware Apollo à l'application Express
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;

    app.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
};

// Appeler la fonction pour démarrer le serveur
startServer().catch(err => {
    console.error('Error starting server:', err);
});
