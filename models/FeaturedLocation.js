const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FeaturedLocation = sequelize.define('FeaturedLocation', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  icon: { 
    type: DataTypes.STRING 
  },
  displayOrder: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    field: 'display_order' // ✅ CRITICAL: Maps to your DB column
  },
  description: { 
    type: DataTypes.STRING 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    field: 'is_active'     // ✅ CRITICAL: Maps to your DB column
  }
}, {
  tableName: 'featured_locations',
  timestamps: true,
  underscored: true // handles created_at / updated_at
});

module.exports = FeaturedLocation;