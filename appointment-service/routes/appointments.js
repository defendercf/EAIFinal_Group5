const express = require('express');
const axios = require('axios');
const Appointment = require('../models/Appointment');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { patient_id, date, time } = req.body;

    if (!patient_id || !date || !time) {
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

    const newAppointment = await Appointment.create({ patient_id, date, time });

    res.json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const patientId = req.query.patient_id;
    let appointments;

    if (patientId) {
      appointments = await Appointment.findAll({ where: { patient_id: patientId } });
    } else {
      appointments = await Appointment.findAll();
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
