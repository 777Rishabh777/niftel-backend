const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Property = sequelize.define('Property', {
  // 1. Basic Info
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT // Use TEXT for long descriptions
  },
  price: {
    type: DataTypes.DECIMAL(15, 2), // Better for money than Integer
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  
  // 2. Arrays (Stored as JSON Text)
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  
  // 3. Classification
  type: {
    type: DataTypes.ENUM('buy', 'sell'),
    defaultValue: 'buy'
  },
  category: {
    type: DataTypes.STRING
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  // 4. Property Details
  bedrooms: {
    type: DataTypes.INTEGER
  },
  area: {
    type: DataTypes.STRING
  },
  society: {
    type: DataTypes.STRING
  },
  floorNumber: {
    type: DataTypes.STRING
  },
  propertyAge: {
    type: DataTypes.STRING
  },
  rera: {
    type: DataTypes.STRING
  },
  builder: {
    type: DataTypes.STRING
  },
  balconies: {
    type: DataTypes.INTEGER
  },
  parking: {
    type: DataTypes.STRING
  },
  pricePerSqft: {
    type: DataTypes.DECIMAL(10, 2)
  },
  configuration: {
    type: DataTypes.STRING
  },

  // 5. Features & Amenities (JSON Arrays)
  features: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('features');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('features', JSON.stringify(val));
    }
  },
  amenities: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('amenities');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('amenities', JSON.stringify(val));
    }
  },

  // 6. Dealer Info (JSON Object)
  dealer_info: { // Mapped from 'dealer' in your Mongo data
    type: DataTypes.TEXT,
    get() {
      const raw = this.getDataValue('dealer_info');
      return raw ? JSON.parse(raw) : null;
    },
    set(val) {
      this.setDataValue('dealer_info', JSON.stringify(val));
    }
  }
}, {
  tableName: 'properties',
  timestamps: true,
  underscored: true
});

module.exports = Property;