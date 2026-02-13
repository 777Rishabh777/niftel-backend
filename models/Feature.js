const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feature = sequelize.define('Feature', {
  value: { type: DataTypes.STRING },  // e.g. "15"
  suffix: { type: DataTypes.STRING }, // e.g. "K+"
  title: { type: DataTypes.STRING },  // e.g. "Happy Clients"
  icon: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  category: { type: DataTypes.STRING, defaultValue: 'stats' },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'features',
  timestamps: true,
  underscored: true
});

module.exports = Feature;