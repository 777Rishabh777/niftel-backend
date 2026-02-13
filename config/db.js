const { Sequelize } = require('sequelize');

// Professional setup using Environment Variables
const sequelize = new Sequelize(
  process.env.DB_NAME || 'infra_niftel',      // Database Name
  process.env.DB_USER || 'infra_nif',         // Database User
  process.env.DB_PASS || 'niftel@123',         // Database Password
  {
    host: process.env.DB_HOST || '108.160.148.102', // Host IP
    dialect: 'mysql',
    logging: false,
    port: 3306, // Standard MySQL port
    sync: { alter: false }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL on cPanel successfully');
    // Removed sequelize.sync() for production to prevent accidental data loss
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
  }
};

module.exports = { sequelize, connectDB };