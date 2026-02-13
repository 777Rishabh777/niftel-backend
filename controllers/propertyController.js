const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { normalizeLocation } = require('../utils/locationMatcher');
const { Op } = require('sequelize');

const safeParse = (val) => {
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch (e) { return val; }
};

const parseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val; 
  if (typeof val === 'string') {
    if (val.trim().startsWith('[')) {
        try { return JSON.parse(val); } catch(e) {}
    }
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

exports.createProperty = async (req, res) => {
  try {
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);

    const propertyData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      type: req.body.type,
      images: images, 
      
      category: req.body.category || '',
      features: parseArray(req.body.features),
      
      verified: String(req.body.verified) === 'true',
      featured: String(req.body.featured) === 'true',
      
      bedrooms: (req.body.bedrooms && !isNaN(req.body.bedrooms)) ? Number(req.body.bedrooms) : null,
      area: req.body.area || '',
      society: req.body.society || '',
      address: req.body.address || '',
      floorNumber: req.body.floorNumber || '',
      propertyAge: req.body.propertyAge || '',
      rera: req.body.rera || '',
      builder: req.body.builder || '',
      balconies: (req.body.balconies && !isNaN(req.body.balconies)) ? Number(req.body.balconies) : null,
      parking: req.body.parking || '',
      pricePerSqft: (req.body.pricePerSqft && !isNaN(req.body.pricePerSqft)) ? Number(req.body.pricePerSqft) : null,
      configuration: req.body.configuration || '',
      
      amenities: parseArray(req.body.amenities)
    };

    if (req.body.dealer) {
        propertyData.dealer_info = safeParse(req.body.dealer);
    }

    const prop = await Property.create(propertyData);
    res.status(201).json({ success: true, property: prop });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const prop = await Property.findByPk(id);
    
    if (!prop) return res.status(404).json({ success: false, message: 'Not found' });

    const body = req.body || {};
    const updateData = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.type !== undefined) updateData.type = body.type;

    // Details
    if (body.category !== undefined) updateData.category = body.category;
    if (body.features !== undefined) updateData.features = parseArray(body.features);
    if (body.verified !== undefined) updateData.verified = String(body.verified) === 'true';
    if (body.featured !== undefined) updateData.featured = String(body.featured) === 'true';
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms ? Number(body.bedrooms) : null;
    if (body.area !== undefined) updateData.area = body.area;

    let finalImages = [];
    
    const newFiles = (req.files && req.files.length) ? req.files.map(f => `/uploads/${f.filename}`) : [];

    let keptImages = [];
    if (body.existingImages) {
        keptImages = parseArray(body.existingImages); 
    } else if (body.images && Array.isArray(body.images)) {
        keptImages = body.images;
    }

    if (newFiles.length > 0 || body.existingImages || body.images) {
        updateData.images = [...keptImages, ...newFiles];
    }

    if (body.society !== undefined) updateData.society = body.society;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.floorNumber !== undefined) updateData.floorNumber = body.floorNumber;
    if (body.propertyAge !== undefined) updateData.propertyAge = body.propertyAge;
    if (body.rera !== undefined) updateData.rera = body.rera;
    if (body.builder !== undefined) updateData.builder = body.builder;
    if (body.balconies !== undefined) updateData.balconies = body.balconies ? Number(body.balconies) : null;
    if (body.parking !== undefined) updateData.parking = body.parking;
    if (body.pricePerSqft !== undefined) updateData.pricePerSqft = body.pricePerSqft ? Number(body.pricePerSqft) : null;
    if (body.configuration !== undefined) updateData.configuration = body.configuration;
    if (body.amenities !== undefined) updateData.amenities = parseArray(body.amenities);
    
    if (body.dealer !== undefined) {
       updateData.dealer_info = safeParse(body.dealer);
    }

    // Update & Save
    await prop.update(updateData);
    
    res.json({ success: true, property: prop });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

exports.listProperties = async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, verified, category, bedrooms, featured } = req.query;

    const whereClause = {};

    if (type) whereClause.type = type;
    if (location) whereClause.location = location; 
    if (verified === 'true') whereClause.verified = true;
    if (featured === 'true') whereClause.featured = true;
    if (category) whereClause.category = category;
    if (bedrooms) whereClause.bedrooms = bedrooms;
    
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    const props = await Property.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, properties: props });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const properties = await Property.findAll();
    
    const locations = [...new Set(properties.map(p => p.location).filter(Boolean))];
    const categories = [...new Set(properties.map(p => p.category).filter(Boolean))];
    const types = [...new Set(properties.map(p => p.type).filter(Boolean))];
    
    res.json({ success: true, filters: { locations, categories, types } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFeaturedProperties = async (req, res) => {
  try {
    const props = await Property.findAll({
      where: { featured: true },
      order: [['created_at', 'DESC']],
      limit: 4
    });
    res.json({ success: true, properties: props });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const prop = await Property.findByPk(req.params.id);
    if (!prop) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, property: prop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const deletedCount = await Property.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount === 0) return res.status(404).json({ success: false, message: 'Not found' });
    
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.bookProperty = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const booking = await Booking.create({ 
        property_id: req.params.id, 
        name, email, phone, message 
    });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};