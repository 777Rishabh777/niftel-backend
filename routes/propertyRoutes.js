const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const propertyController = require('../controllers/propertyController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/\s+/g, '_');
        cb(null, Date.now() + '-' + cleanName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if(mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// ROUTES

// 1. CREATE Property  
router.post('/', upload.array('images', 10), propertyController.createProperty);

// 2. UPDATE Property 
router.put('/:id', upload.array('images', 10), propertyController.updateProperty);

// 3. DELETE Property
router.delete('/:id', propertyController.deleteProperty);

// 4. LIST Properties (Public)
router.get('/', propertyController.listProperties);

// GET Featured Properties
router.get('/featured', propertyController.getFeaturedProperties);

// GET Filter Options 
router.get('/filters', propertyController.getFilters);

// 5. GET Single Property
router.get('/:id', propertyController.getProperty);

// 6. BOOK Property
router.post('/:id/book', propertyController.bookProperty);

module.exports = router;