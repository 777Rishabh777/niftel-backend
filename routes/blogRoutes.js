const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');

//  MULTER CONFIGURATION (Handles Blog Images)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//  GET Routes
router.get('/', blogController.getAllBlogs);             
router.get('/admin/all', blogController.getAllBlogsAdmin); 
router.get('/slug/:slug', blogController.getBlogBySlug);   
router.get('/id/:id', blogController.getBlogById);         

//  POST Routes
router.post('/', upload.single('image'), blogController.createBlog); 
router.patch('/:id/view', blogController.incrementViews);           

//  PUT Routes
router.put('/:id', upload.single('image'), blogController.updateBlog); 

// DELETE Routes
router.delete('/:id', blogController.deleteBlog); // Delete blog

// Export router
module.exports = router;
