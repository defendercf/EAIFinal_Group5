const express = require('express');
const axios = require('axios');
const Review = require('../models/Review');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { patient_id, appointment_id, rating, comment } = req.body;

    if (!patient_id || !appointment_id || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate patient_id
    try {
      const patientResp = await axios.get(`http://localhost:8001/patients/${patient_id}`);
      if (patientResp.status !== 200) {
        return res.status(400).json({ error: 'Invalid patient ID' });
      }
    } catch {
      return res.status(400).json({ error: 'UserService unavailable or invalid patient' });
    }

    // Validate appointment_id
    try {
      const appointmentResp = await axios.get(`http://localhost:8002/appointments/${appointment_id}`);
      if (appointmentResp.status !== 200) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
      }
    } catch {
      return res.status(400).json({ error: 'AppointmentService unavailable or invalid appointment' });
    }

    // Placeholder sentiment (you can integrate OpenAI here)
    const sentiment = 'neutral';

    const newReview = await Review.create({ patient_id, appointment_id, rating, comment, sentiment });

    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const patientId = req.query.patient_id;
    let reviews;

    if (patientId) {
      reviews = await Review.findAll({ where: { patient_id: patientId } });
    } else {
      reviews = await Review.findAll();
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
