const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT // TEXT is better for descriptions than STRING
  },
  price: {
    // DECIMAL is better for money than FLOAT or INTEGER
    // (10, 2) means up to 10 digits total, 2 of them after decimal (e.g. 99999999.99)
    type: DataTypes.DECIMAL(10, 2) 
  },
  imageURL: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'services',
  timestamps: true,
  underscored: true // Maps createdAt -> created_at
});

module.exports = Service;