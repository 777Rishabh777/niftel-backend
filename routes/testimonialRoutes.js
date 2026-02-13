const express = require("express");
const router = express.Router();
const controller = require("../controllers/testimonialController");

// 1. LIST All
router.get("/", controller.getTestimonials);

// 2. GET Single 
router.get("/:id", controller.getTestimonialById);

// 3. CREATE 
router.post("/", controller.addTestimonial);

// 4. UPDATE Existing
router.put("/:id", controller.updateTestimonial);

// 5. DELETE
router.delete("/:id", controller.deleteTestimonial);

module.exports = router;