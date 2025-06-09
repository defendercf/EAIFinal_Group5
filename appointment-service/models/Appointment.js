const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Appointment = sequelize.define('Appointment', {
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'completed' },
}, {
  timestamps: true,
});

module.exports = Appointment;
