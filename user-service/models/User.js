const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // import Sequelize instance from index.js

const User = sequelize.define('User', {
  patient_name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = User;
