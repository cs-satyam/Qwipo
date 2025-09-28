const Recommendation = require('../models/recommendation.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// Get recommendations for logged-in user
async function getUserRecommendations(req, res) {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const recommendations = await Recommendation.getRecommendationsForUser(userId, limit);
    
    res.json({
      message: 'Recommendations retrieved successfully',
      count: recommendations.length,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Generate recommendations based on user's order history
async function generateRecommendations(req, res) {
  try {
    const userId = req.user.userId;
    
    // Get user's order history
    const orders = await Order.find({ retailer: userId })
      .populate('products.product')
      .sort({ createdAt: -1 })
      .limit(10);

    if (orders.length === 0) {
      // For new users, recommend trending products
      await generateTrendingRecommendations(userId);
    } else {
      // Generate recommendations based on purchase history
      await generatePersonalizedRecommendations(userId, orders);
    }

    // Get the newly generated recommendations
    const recommendations = await Recommendation.getRecommendationsForUser(userId, 10);
    
    res.json({
      message: 'Recommendations generated successfully',
      count: recommendations.length,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Helper function to generate trending recommendations for new users
async function generateTrendingRecommendations(userId) {
  try {
    // Get products with highest stock (assuming popular items)
    const trendingProducts = await Product.find({ stock: { $gt: 0 } })
      .sort({ stock: -1 })
      .limit(5);

    for (const product of trendingProducts) {
      await Recommendation.createRecommendation(
        userId,
        product._id,
        0.7, // Base score for trending items
        'trending',
        { 
          category_match: false,
          price_similarity: 0,
          purchase_frequency: 0,
        }
      );
    }
  } catch (err) {
    console.error('Error generating trending recommendations:', err);
  }
}

// Helper function to generate personalized recommendations
async function generatePersonalizedRecommendations(userId, orders) {
  try {
    // Extract purchased products and categories
    const purchasedProducts = new Set();
    const categoryFrequency = {};
    const priceRanges = [];

    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product) {
          purchasedProducts.add(item.product._id.toString());
          
          // Count category frequency
          const category = item.product.category;
          categoryFrequency[category] = (categoryFrequency[category] || 0) + item.quantity;
          
          // Collect price ranges
          priceRanges.push(item.product.price);
        }
      });
    });

    // Calculate average price range
    const avgPrice = priceRanges.reduce((sum, price) => sum + price, 0) / priceRanges.length;
    const priceRange = { min: avgPrice * 0.7, max: avgPrice * 1.3 };

    // Find products in similar categories
    const preferredCategories = Object.keys(categoryFrequency)
      .sort((a, b) => categoryFrequency[b] - categoryFrequency[a])
      .slice(0, 3);

    for (const category of preferredCategories) {
      const similarProducts = await Product.find({
        category: category,
        _id: { $nin: Array.from(purchasedProducts) },
        price: { $gte: priceRange.min, $lte: priceRange.max },
        stock: { $gt: 0 }
      }).limit(3);

      for (const product of similarProducts) {
        const score = calculateRecommendationScore(product, categoryFrequency[category], avgPrice);
        
        await Recommendation.createRecommendation(
          userId,
          product._id,
          score,
          'similar_category',
          {
            category_match: true,
            price_similarity: 1 - Math.abs(product.price - avgPrice) / avgPrice,
            purchase_frequency: categoryFrequency[category],
          }
        );
      }
    }

    // Find complementary products (different categories but commonly bought together)
    const complementaryProducts = await Product.find({
      category: { $nin: preferredCategories },
      price: { $lte: priceRange.max },
      stock: { $gt: 0 }
    }).limit(2);

    for (const product of complementaryProducts) {
      await Recommendation.createRecommendation(
        userId,
        product._id,
        0.6, // Lower score for complementary items
        'complementary',
        {
          category_match: false,
          price_similarity: 1 - Math.abs(product.price - avgPrice) / avgPrice,
          purchase_frequency: 0,
        }
      );
    }
  } catch (err) {
    console.error('Error generating personalized recommendations:', err);
  }
}

// Calculate recommendation score based on various factors
function calculateRecommendationScore(product, categoryFrequency, avgPrice) {
  let score = 0.5; // Base score

  // Category preference weight (0.3)
  score += (categoryFrequency / 10) * 0.3;

  // Price similarity weight (0.2)
  const priceSimilarity = 1 - Math.abs(product.price - avgPrice) / avgPrice;
  score += priceSimilarity * 0.2;

  // Stock availability weight (0.1)
  score += Math.min(product.stock / 100, 1) * 0.1;

  // Ensure score is between 0 and 1
  return Math.min(Math.max(score, 0), 1);
}

// Create manual recommendation (admin function)
async function createRecommendation(req, res) {
  try {
    const { userId, productId, score, reason, metadata } = req.body;

    if (!userId || !productId || !score || !reason) {
      return res.status(400).json({ 
        message: 'userId, productId, score, and reason are required' 
      });
    }

    const recommendation = await Recommendation.createRecommendation(
      userId, 
      productId, 
      score, 
      reason, 
      metadata
    );

    res.status(201).json({
      message: 'Recommendation created successfully',
      recommendation,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete recommendation
async function deleteRecommendation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const recommendation = await Recommendation.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    res.json({ message: 'Recommendation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getUserRecommendations,
  generateRecommendations,
  createRecommendation,
  deleteRecommendation,
};
