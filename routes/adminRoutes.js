const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, isSuperAdmin } = require('../middleware/auth');

// --- PUBLIC ROUTES ---
router.post('/login', adminController.login);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);

// --- PROTECTED PERSONAL ROUTES ---
router.get('/me', isAdmin, adminController.getMe);
router.post('/logout', isAdmin, adminController.logout);
router.post('/change-password', isAdmin, adminController.changePassword);
router.put('/update-profile', isAdmin, adminController.updateProfile);

// --- SYSTEM USER MANAGEMENT (Super Admin Only) ---
router.get('/all', isAdmin, adminController.getAllAdmins);
router.post('/create', isAdmin, isSuperAdmin, adminController.createAdmin);
router.put('/:id', isAdmin, isSuperAdmin, adminController.updateAdmin);
router.delete('/:id', isAdmin, isSuperAdmin, adminController.deleteAdmin);

module.exports = router;