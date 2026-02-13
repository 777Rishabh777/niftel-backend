const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.TEXT // Use TEXT for longer bios
  },
  facebook: {
    type: DataTypes.STRING
  },
  twitter: {
    type: DataTypes.STRING
  },
  linkedin: {
    type: DataTypes.STRING
  },
  instagram: {
    type: DataTypes.STRING
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'teams',
  timestamps: true,
  underscored: true
});

module.exports = Team;