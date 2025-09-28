const Product = require('../models/product.model');

// Create a new product
async function createProduct(req, res) {
  try {
    const { name, description, category, price, stock, tags, image, thumbnail } = req.body;

    // distributor from logged-in user
    const distributor = req.user.userId;

    const product = new Product({
      name,
      description,
      category,
      price,
      stock,
      image,
      thumbnail,
      distributor,
      tags,
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all products with search and filtering
async function getProducts(req, res) {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      tags, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Only show products in stock
    query.stock = { $gt: 0 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const products = await Product.find(query)
      .populate('distributor', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        tags,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get single product by ID
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate('distributor', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update product
async function updateProduct(req, res) {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    // Ownership check: only the distributor (retailer) can edit
    if (existing.distributor && existing.distributor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update this product' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete product
async function deleteProduct(req, res) {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    // Ownership check
    if (existing.distributor && existing.distributor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this product' });
    }
    await existing.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get products created by the logged-in retailer
async function getMyProducts(req, res) {
  try {
    const products = await Product.find({ distributor: req.user.userId }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
