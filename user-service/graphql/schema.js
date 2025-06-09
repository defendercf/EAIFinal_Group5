const { gql } = require('apollo-server');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const typeDefs = gql`
  type User {
    id: ID!
    patient_name: String!
    username: String!
    email: String!
    date_of_birth: String!
    gender: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  input CreateUserInput {
    patient_name: String!
    username: String!
    email: String!
    password: String!
    date_of_birth: String!
    gender: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
  }
`;

const resolvers = {
  Query: {
    users: () => User.findAll(),
    user: (_, { id }) => User.findByPk(id),
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      return User.create({ ...input, password: hashedPassword });
    },
  },
};

module.exports = { typeDefs, resolvers };
