const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Payment = sequelize.define('Payment', {
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100000},
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'completed' },
}, {
  timestamps: true,
});

module.exports = Payment;
