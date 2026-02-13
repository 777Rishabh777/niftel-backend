const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require("../controllers/galleryController"); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
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

// POST /api/gallery
router.post("/", upload.single('galleryImage'), controller.addGallery);

// GET /api/gallery
router.get("/", controller.getGallery);

// GET /api/gallery/all
router.get("/all", controller.getAllGallery);

// PUT /api/gallery/:id
router.put("/:id", upload.single('galleryImage'), controller.updateGallery);

// DELETE /api/gallery/:id
router.delete("/:id", controller.deleteGallery);

module.exports = router;