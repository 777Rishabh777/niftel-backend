const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, currentPassword } = req.body;
        const adminId = req.session.adminId; // Get ID from session

        // 1. Find the admin
        const admin = await Admin.findByPk(adminId);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        // 2. Verify password before allowing update
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password!" });

        // 3. Update the record
        admin.fullName = fullName;
        admin.email = email;
        await admin.save();

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};