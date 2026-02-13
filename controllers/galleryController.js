const Gallery = require('../models/Gallery');

// ADD gallery item
exports.addGallery = async (req, res) => {
  try {
    const galleryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'general',
      order: req.body.order || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };
    
    if (req.file) {
      galleryData.image = '/uploads/' + req.file.filename;
    } else if (req.body.image) {
      galleryData.image = req.body.image;
    } else {
        return res.status(400).json({ success: false, message: 'Image is required' });
    }
    
    const gallery = await Gallery.create(galleryData);
    res.json({ success: true, gallery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// GET all gallery items 
exports.getGallery = async (req, res) => {
  console.log('📢 getGallery called');
  try {
    const gallery = await Gallery.findAll({
      where: { isActive: true },
      order: [
        ['order', 'ASC'],
        ['created_at', 'DESC']
      ]
    });
    
    console.log('✅ Found gallery items:', gallery.length);
    res.json({ success: true, gallery });
  } catch (err) {
    console.error('❌ Error in getGallery:', err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// GET all gallery items 
exports.getAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findAll({
      order: [
        ['order', 'ASC'],
        ['created_at', 'DESC']
      ]
    });
    res.json({ success: true, gallery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// UPDATE gallery item
exports.updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByPk(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    // Build update object
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.order !== undefined) updateData.order = req.body.order;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    
    // Handle Image Update
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }
    
    // Update the record
    await gallery.update(updateData);
    
    // Send back the updated object
    res.json({ success: true, gallery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// DELETE gallery item
exports.deleteGallery = async (req, res) => {
  try {
    const deletedCount = await Gallery.destroy({
      where: { id: req.params.id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};