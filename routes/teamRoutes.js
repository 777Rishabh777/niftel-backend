const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teamController = require('../controllers/teamController'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// GET All Team Members
router.get('/', teamController.getAllTeamMembers);

// GET Single Member
router.get('/:id', teamController.getTeamMember);

// CREATE Member 
router.post('/', upload.single('photo'), teamController.createTeamMember);

// UPDATE Member 
router.put('/:id', upload.single('photo'), teamController.updateTeamMember);

// DELETE Member
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;