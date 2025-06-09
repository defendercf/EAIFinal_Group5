const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { ApolloServer } = require('apollo-server');
const sequelize = require('./models/index');
const { typeDefs, resolvers } = require('./graphql/schema');

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await sequelize.sync();

  server.listen({ port: process.env.PORT || 8001 }).then(({ url }) => {
    console.log(`🚀 User service ready at ${url}`);
  });
}

startServer();
