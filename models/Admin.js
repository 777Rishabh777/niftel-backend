const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'super_admin'),
        defaultValue: 'admin'
    },
    // --- FORGOT PASSWORD FIELDS ---
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Add this to your Admin attributes in models/Admin.js
lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
}
}, {
    tableName: 'admins',
    timestamps: true 
});

module.exports = Admin;