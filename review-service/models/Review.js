const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Review = sequelize.define('Review', {
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
  comment_censored: { type: DataTypes.TEXT, allowNull: false },
  sentiment: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Review;
