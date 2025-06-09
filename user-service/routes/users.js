const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { patient_name, username, email, password, date_of_birth, gender } = req.body;

    if (!patient_name || !username || !email || !password || !date_of_birth || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      patient_name,
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      gender,
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:8003/reviews?patient_id=${req.params.id}`);
    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'ReviewService unavailable' });
  }
});

module.exports = router;
