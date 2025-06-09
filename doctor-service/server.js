require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const sequelize = require('./models/index');
const { typeDefs, resolvers } = require('./graphql/schema');

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await sequelize.sync();

  server.listen({ port: process.env.PORT || 8004 }).then(({ url }) => {
    console.log(`🚀 Doctor service ready at ${url}`);
  });
}

startServer();
