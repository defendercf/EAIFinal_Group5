const { gql } = require('apollo-server');
const Appointment = require('../models/Appointment');
const axios = require('axios');

const typeDefs = gql`
  type Appointment {
    id: ID!
    patient_id: Int!
    doctor_id: Int!
    date: String!
    time: String!
    status: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    appointments(patient_id: Int): [Appointment]
    appointment(id: ID!): Appointment
  }

  input CreateAppointmentInput {
    patient_id: Int!
    doctor_id: Int!
    date: String!
    time: String!
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): Appointment
  }
`;

const resolvers = {
  Query: {
    appointments: (_, { patient_id }) => {
      if (patient_id) {
        return Appointment.findAll({ where: { patient_id } });
      }
      return Appointment.findAll();
    },
    appointment: (_, { id }) => Appointment.findByPk(id),
  },
  Mutation: {
    createAppointment: async (_, { input }) => {
      // Validate patient_id via User Service GraphQL API
      const userQuery = `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
          }
        }
      `;
      const userVariables = { id: input.patient_id };

      try {
        const userResponse = await axios.post(
          'http://localhost:8001/', // User service GraphQL endpoint
          {
            query: userQuery,
            variables: userVariables,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!userResponse.data.data || !userResponse.data.data.user) {
          throw new Error('Invalid patient ID');
        }
      } catch (error) {
        console.error('UserService validation error:', error.message);
        throw new Error('UserService unavailable or invalid patient');
      }

      // Validate doctor_id via Doctor Service GraphQL API
      const doctorQuery = `
        query GetDoctor($id: ID!) {
          doctor(id: $id) {
            id
          }
        }
      `;
      const doctorVariables = { id: input.doctor_id };

      try {
        const doctorResponse = await axios.post(
          'http://localhost:8004/', // Doctor service GraphQL endpoint
          {
            query: doctorQuery,
            variables: doctorVariables,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!doctorResponse.data.data || !doctorResponse.data.data.doctor) {
          throw new Error('Invalid doctor ID');
        }
      } catch (error) {
        console.error('DoctorService validation error:', error.message);
        throw new Error('DoctorService unavailable or invalid doctor');
      }

      // Create appointment with status pending
      return Appointment.create({ ...input, status: 'pending' });
    },
  },
};


module.exports = { typeDefs, resolvers };
