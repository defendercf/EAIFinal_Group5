const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Doctor = sequelize.define('Doctor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'doctors',
});

module.exports = Doctor;
