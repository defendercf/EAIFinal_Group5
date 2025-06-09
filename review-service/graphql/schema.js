const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { gql } = require('apollo-server');
const Review = require('../models/Review');
const axios = require('axios');

const typeDefs = gql`
  type Review {
    id: ID!
    patient_id: Int!
    doctor_id: Int!
    appointment_id: Int!
    rating: Int!
    comment: String!
    comment_censored: String!
    sentiment: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    reviews(patient_id: Int): [Review]
  }

  input CreateReviewInput {
    appointment_id: Int!
    rating: Int!
    comment: String!
    comment_censored: String!
  }

  type Mutation {
    createReview(input: CreateReviewInput!): Review
  }
`;

const resolvers = {
  Query: {
    reviews: (_, { patient_id }) => {
      if (patient_id) {
        return Review.findAll({ where: { patient_id } });
      }
      return Review.findAll();
    },
  },
  Mutation: {
    createReview: async (_, { input }) => {
      // Query to get appointment with patient_id and doctor_id
      const appointmentQuery = `
        query GetAppointment($id: ID!) {
          appointment(id: $id) {
            id
            patient_id
            doctor_id
          }
        }
      `;
      const appointmentVariables = { id: input.appointment_id };

      let patient_id, doctor_id;
      try {
        const appointmentResp = await axios.post(
          'http://localhost:8002/',
          { query: appointmentQuery, variables: appointmentVariables },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (!appointmentResp.data.data || !appointmentResp.data.data.appointment) {
          throw new Error('Invalid appointment ID');
        }
        patient_id = appointmentResp.data.data.appointment.patient_id;
        doctor_id = appointmentResp.data.data.appointment.doctor_id;
      } catch (error) {
        console.error('AppointmentService validation error:', error.message);
        throw new Error('AppointmentService unavailable or invalid appointment');
      }

      // Optionally validate patient_id via User Service if needed

      // Placeholder sentiment (you can integrate OpenAI here)
      let sentiment = 'neutral';
      const prompt = `Please analyze the sentiment based on the following review comment and its rating (in the context of Healthcare Appointments Review). Reply with only one or two words: positive, negative, highly positive, highly negative, or neutral.

      Comment: "${input.comment}"
      Rating: ${input.rating}`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that classifies the sentiment of a short text as positive, neutral, negative, highly positive, or highly negative.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });''
        console.log(completion.choices[0].message.content)
        const sentiment = completion.choices[0].message.content.toLowerCase();
        return Review.create({ ...input, patient_id, doctor_id, sentiment });
        // parse sentimentResponse as needed
      } catch (err) {
        console.error('OpenAI sentiment analysis error:', err.message);
        return Review.create({ ...input, patient_id, doctor_id, sentiment });
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
