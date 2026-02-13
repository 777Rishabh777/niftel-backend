const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Blog = sequelize.define('Blog', {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  excerpt: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT('long') }, // Long text for blog content
  image: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  published_date: { type: DataTypes.STRING },
  
  // ⚡ Explicitly map 'readTime' in code to 'read_time' in DB
  readTime: { 
    type: DataTypes.STRING, 
    field: 'read_time' 
  },
  
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  category: { type: DataTypes.STRING },
  tags: { type: DataTypes.JSON }, // MySQL supports JSON columns
  
  // SEO Fields
  metaTitle: { type: DataTypes.STRING, field: 'meta_title' },
  metaDescription: { type: DataTypes.TEXT, field: 'meta_description' },
  metaKeywords: { type: DataTypes.STRING, field: 'meta_keywords' },
  
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'blogs',
  timestamps: true,
  underscored: true // This ensures standard columns like created_at
});

module.exports = Blog;