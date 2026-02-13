const { sequelize } = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
    try {
        await sequelize.sync({ alter: true }); 
        
        const hashedPassword = await bcrypt.hash('admin123', 10); // Change this password!

        await Admin.create({
            fullName: 'Super Admin',
            email: 'info@niftelinfra.com', // This enables the Forgot Password email
            password: hashedPassword,
            role: 'super_admin' // This enables the "Create Admin" panel
        });

        console.log("✅ Success! Super Admin created.");
        console.log("📧 Email: info@niftelinfra.com");
        console.log("🔑 Password: admin123");
        process.exit();
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

createSuperAdmin();