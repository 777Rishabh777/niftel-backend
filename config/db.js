const { Sequelize } = require('sequelize');

// Use environment variables from Render, or fallback to local for XAMPP
const sequelize = new Sequelize(
  process.env.DB_NAME || 'niftel_infra',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1', // <--- This now uses the tunnel!
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,         // <--- This now uses the tunnel port!
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL via Tunnel');
    await sequelize.sync();
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };