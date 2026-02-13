const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const SibApiV3Sdk = require('@getbrevo/brevo');

// --- 1. LOGIN API ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // UPDATE LAST ACTIVE TIMESTAMP HERE
        admin.lastActive = new Date(); 
        await admin.save();

        const token = jwt.sign(
            { id: admin.id, role: admin.role || 'admin' }, 
            'niftel_secret_key_999', 
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            message: "Login Successful", 
            token: token, 
            admin: {
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
                lastActive: admin.lastActive 
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// --- 9. LOGOUT API ---
exports.logout = async (req, res) => {
    try {
        const adminId = req.admin.id; 

        await Admin.update(
            { lastActive: new Date() }, 
            { where: { id: adminId } }
        );

        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false });
    }
};
// --- 2. GET CURRENT ADMIN ---
exports.getMe = async (req, res) => {
    res.json({ success: true, admin: req.admin });
};

// --- 2. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide your registered email address." });
        }

        // 1. Check Database
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: "This email is not registered. Please try again with your correct admin email." 
            });
        }

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        
        apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

        // 3. Generate Token
        const resetToken = crypto.randomBytes(20).toString('hex');
        admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        admin.resetPasswordExpire = Date.now() + 30 * 60 * 1000; 
        await admin.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password-page?token=${resetToken}`;

        // 4. Construct Email
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { 
            "name": "Niftel Admin Portal", 
            "email": process.env.SENDER_EMAIL || "info@niftelinfra.com" 
        };
        sendSmtpEmail.to = [{ "email": admin.email, "name": admin.fullName }];
        sendSmtpEmail.subject = "Password Reset Link - Niftel Infra";
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #E97614;">Reset Your Password</h2>
                <p>Hello <strong>${admin.fullName}</strong>,</p>
                <p>You requested a password reset for your admin account. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #E97614; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If you didn't request this, ignore this email. Link expires in 30 mins.</p>
            </div>
        `;

        // 5. Send
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        res.json({ success: true, message: "A reset link has been sent to your registered email address." });

    } catch (error) {
        console.error("--- BREVO ERROR ---");
        console.error(error); 
        res.status(500).json({ success: false, message: "Failed to send email. Check terminal for details." });
    }
};

// --- 3. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpire: { [Op.gt]: Date.now() }
            }
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
        }

        admin.password = await bcrypt.hash(password, 10);
        admin.resetPasswordToken = null;
        admin.resetPasswordExpire = null;
        await admin.save();

        res.json({ success: true, message: "Password updated successfully! You can now login." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// --- 5. SYSTEM USERS: GET ALL ---
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({

            attributes: ['id', 'fullName', 'email', 'role', 'createdAt', 'lastActive']
        });
        res.json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 6. SYSTEM USERS: CREATE ---
exports.createAdmin = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        
        const exists = await Admin.findOne({ where: { email } });
        if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({ 
            fullName, 
            email, 
            password: hashedPassword, 
            role: role || 'admin' 
        });

        res.json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 7. SYSTEM USERS ---
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, role, password } = req.body;
        
        const updateData = { fullName, email, role };
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await Admin.update(updateData, { where: { id } });
        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 8. SYSTEM USERS: DELETE ---
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.admin && req.admin.id == id) {
            return res.status(400).json({ success: false, message: "You cannot delete yourself!" });
        }
        await Admin.destroy({ where: { id } });
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// --- Update Logged-in Admin's Name ---
exports.updateProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.admin.id);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        admin.fullName = req.body.fullName;
        await admin.save();

        res.json({ success: true, message: "Profile updated!", fullName: admin.fullName });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Change Logged-in Admin's Password ---
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findByPk(req.admin.id);

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Current password incorrect" });

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};