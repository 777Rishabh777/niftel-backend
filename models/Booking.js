const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  // 1. Foreign Key (Replaces ObjectId ref: 'Property')
  // This links this booking to a specific property ID in your SQL table
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // 2. Customer Details
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true // Adds automatic email format validation
    }
  },
  phone: {
    type: DataTypes.STRING
    // allowNull is true by default, matching your schema
  },
  message: {
    type: DataTypes.TEXT // Use TEXT for longer messages
  },

  // 3. Status (Enum Handling)
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'bookings',
  timestamps: true,   // Creates created_at and updated_at
  underscored: true   // Maps camelCase (propertyId) to snake_case (property_id)
});

module.exports = Booking;