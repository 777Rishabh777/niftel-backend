const { Sequelize } = require('sequelize');

// Use environment variables from Render, or fallback to local for XAMPP
const sequelize = new Sequelize(
  'infra_niftel',      // DB Name
  'infra_nif',         // DB User
  'niftel@123',     // DB Password
  {
    host: '162.241.xx.xx', // ⬅️ PASTE YOUR SHARED IP HERE
    dialect: 'mysql',
    logging: false,
    sync: { alter: false }
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