const Feature = require('../models/Feature');

// 1. GET ALL
exports.getFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll({ order: [['order', 'ASC']] });
    res.json({ success: true, features: features || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. GET SINGLE 
exports.getFeatureById = async (req, res) => {
  try {
    const feature = await Feature.findByPk(req.params.id);
    if (!feature) {
        return res.status(404).json({ success: false, message: "Feature not found" });
    }
    res.json({ success: true, feature });
  } catch (err) {
    console.error("Get ID Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. CREATE
exports.createFeature = async (req, res) => {
  try {
    const feature = await Feature.create(req.body);
    res.json({ success: true, feature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. UPDATE
exports.updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findByPk(req.params.id);
    if (!feature) return res.status(404).json({ success: false, message: "Not found" });
    
    await feature.update(req.body);
    res.json({ success: true, feature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. DELETE
exports.deleteFeature = async (req, res) => {
  try {
    const count = await Feature.destroy({ where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};