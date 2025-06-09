const { gql } = require('apollo-server');
const Payment = require('../models/Payment');
const axios = require('axios');

const typeDefs = gql`
  type Payment {
    id: ID!
    patient_id: Int!
    appointment_id: Int!
    amount: Int!
    status: String!
    createdAt: String!
    updatedAt: String!
    appointment: Appointment
  }

  type Appointment {
    id: ID!
    patient_id: Int!
    doctor_id: Int!
    date: String!
    time: String!
    status: String!
  }

  type Query {
    payments: [Payment!]!
    payment(id: ID!): Payment
  }

  input CreatePaymentInput {
    appointment_id: Int!
    amount: Int
    status: String
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Payment!
  }
`;

const resolvers = {
  Payment: {
    appointment: async (payment) => {
      const appointmentQuery = `
        query GetAppointment($id: ID!) {
          appointment(id: $id) {
            id
            patient_id
            doctor_id
            date
            time
            status
          }
        }
      `;
      const variables = { id: payment.appointment_id };

      try {
        const response = await axios.post(
          'http://localhost:8002/',
          { query: appointmentQuery, variables },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.data.data || !response.data.data.appointment) {
          throw new Error('Appointment not found');
        }
        return response.data.data.appointment;
      } catch (error) {
        console.error('Failed to fetch appointment:', error.message);
        return null;
      }
    },
  },
  Query: {
    payments: () => Payment.findAll(),
    payment: (_, { id }) => Payment.findByPk(id),
  },
  Mutation: {
    createPayment: async (_, { input }) => {
      // Fetch patient_id from appointment service
      const appointmentQuery = `
        query GetAppointment($id: ID!) {
          appointment(id: $id) {
            patient_id
          }
        }
      `;
      const variables = { id: input.appointment_id };

      let patient_id;
      try {
        const response = await axios.post(
          'http://localhost:8002/',
          { query: appointmentQuery, variables },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.data.data || !response.data.data.appointment) {
          throw new Error('Appointment not found');
        }
        patient_id = response.data.data.appointment.patient_id;
      } catch (error) {
        console.error('Failed to fetch patient_id from appointment:', error.message);
        throw new Error('Invalid appointment_id or appointment service unavailable');
      }

      // Create payment with patient_id from appointment service
      return Payment.create({
        patient_id,
        appointment_id: input.appointment_id,
        amount: input.amount,
        status: input.status || 'completed',
      });
    },
  },
};

module.exports = { typeDefs, resolvers };
