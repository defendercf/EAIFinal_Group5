const { gql } = require('apollo-server');
const Doctor = require('../models/Doctor'); // Adjust path as needed

const typeDefs = gql`
  type Doctor {
    id: ID!
    name: String!
    specialty: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    doctors: [Doctor]
    doctor(id: ID!): Doctor
  }

  input CreateDoctorInput {
    name: String!
    specialty: String!
  }

  type Mutation {
    createDoctor(input: CreateDoctorInput!): Doctor
  }
`;

const resolvers = {
  Query: {
    doctors: () => Doctor.findAll(),
    doctor: (_, { id }) => Doctor.findByPk(id),
  },
  Mutation: {
    createDoctor: (_, { input }) => Doctor.create(input),
  },
};

module.exports = { typeDefs, resolvers };
