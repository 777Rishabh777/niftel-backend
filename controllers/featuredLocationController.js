const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

const formatLoc = (l) => ({
    id: l.id,
    name: l.name,
    icon: l.icon,
    description: l.description,
    displayOrder: l.display_order,
    isActive: l.is_active === 1,  
    propertyCount: 5 
});

// 1. GET ALL 
exports.getAll = async (req, res) => {
  try {
    const rawData = await sequelize.query(
      "SELECT * FROM featured_locations WHERE is_active = 1 ORDER BY display_order ASC",
      { type: QueryTypes.SELECT }
    );
    
    const locations = rawData.map(formatLoc);
    
    res.json({ success: true, locations }); 
  } catch (err) {
    console.error("Public Fetch Error:", err);
    res.status(500).json({ success: false, message: err });
  }
};

// 2. GET ALL (Admin) - includes inactive and display order
exports.getAllAdmin = async (req, res) => {
  try {
    const rawData = await sequelize.query(
      "SELECT * FROM featured_locations ORDER BY display_order ASC", 
      { type: QueryTypes.SELECT }
    );
    const locations = rawData.map(formatLoc);
    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. GET SINGLE (Edit)
exports.getById = async (req, res) => {
  try {
    const results = await sequelize.query(
      "SELECT * FROM featured_locations WHERE id = ?",
      { replacements: [req.params.id], type: QueryTypes.SELECT }
    );
    if (!results.length) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, location: formatLoc(results[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. CREATE
exports.create = async (req, res) => {
  try {
    const { name, icon, description, displayOrder, isActive } = req.body;
    await sequelize.query(
      `INSERT INTO featured_locations (name, icon, description, display_order, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      { replacements: [name, icon, description, displayOrder, isActive ? 1 : 0] }
    );
    res.json({ success: true, message: "Created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. UPDATE
exports.update = async (req, res) => {
  try {
    const { name, icon, description, displayOrder, isActive } = req.body;
    await sequelize.query(
      `UPDATE featured_locations 
       SET name=?, icon=?, description=?, display_order=?, is_active=?, updated_at=NOW() 
       WHERE id=?`,
      { replacements: [name, icon, description, displayOrder, isActive ? 1 : 0, req.params.id] }
    );
    res.json({ success: true, message: "Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. DELETE
exports.delete = async (req, res) => {
  try {
    await sequelize.query("DELETE FROM featured_locations WHERE id = ?", { replacements: [req.params.id] });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};