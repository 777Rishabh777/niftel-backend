const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { published: true },
      order: [['created_at', 'DESC']] 
    });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Error fetching blogs', error: error.message });
  }
};

exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Error fetching blogs', error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Error fetching blog', error: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await blog.increment('views');
    
    await blog.reload();

    res.json({ success: true, views: blog.views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ success: false, message: 'Error incrementing views', error: error.message });
  }
};

// Helper function to generate slug (Same as before)
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, author, readTime, category, tags, metaTitle, metaDescription, metaKeywords, featured, published } = req.body;
    
    const blogSlug = slug || generateSlug(title);
    
    const newBlog = await Blog.create({
      title,
      slug: blogSlug,
      excerpt,
      content,
      image,
      author: author || 'Admin',
      readTime: readTime || '5 min read',
      category: category || 'Real Estate',
      tags: tags || [], 
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      metaKeywords: metaKeywords || '',
      featured: featured || false,
      published: published !== undefined ? published : true
    });

    res.status(201).json({ success: true, blog: newBlog, message: 'Blog created successfully' });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: 'Error creating blog', error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, author, readTime, category, tags, metaTitle, metaDescription, metaKeywords, featured, published } = req.body;
    
    // Check if blog exists first
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const blogSlug = slug || (title ? generateSlug(title) : blog.slug);

    await blog.update({
      title,
      slug: blogSlug,
      excerpt,
      content,
      image,
      author,
      readTime,
      category,
      tags,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      metaKeywords: metaKeywords || '',
      featured,
      published
    });

    res.json({ success: true, blog: blog, message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Error updating blog', error: error.message });
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).json({ success: false, message: 'Error fetching blog', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedCount = await Blog.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Error deleting blog', error: error.message });
  }
};