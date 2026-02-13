const express = require('express');
const router = express.Router();
const controller = require('../controllers/featureController');

router.get('/', controller.getFeatures);
router.get('/admin', controller.getFeatures); 
router.get('/:id', controller.getFeatureById);

// Add, Edit, Delete
router.post('/', controller.createFeature);
router.put('/:id', controller.updateFeature);
router.delete('/:id', controller.deleteFeature);

module.exports = router;