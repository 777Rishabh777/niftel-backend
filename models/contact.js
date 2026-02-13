const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING
  },
  message: {
    type: DataTypes.TEXT, // Use TEXT for longer messages
    allowNull: false
  },
  // We explicitly match the column names you added via SQL earlier
  propertyId: {
    type: DataTypes.STRING,
    field: 'propertyId' // Forces Sequelize to use 'propertyId' column, not 'property_id'
  },
  propertyName: {
    type: DataTypes.STRING,
    field: 'propertyName'
  },
  service: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  underscored: true // This handles created_at and updated_at automatically
});

module.exports = Contact;