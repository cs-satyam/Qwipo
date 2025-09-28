const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.5,
    },
    reason: {
      type: String,
      enum: [
        'frequently_bought',
        'similar_category',
        'price_range',
        'user_preference',
        'trending',
        'seasonal',
        'complementary'
      ],
      required: true,
    },
    metadata: {
      category_match: Boolean,
      price_similarity: Number,
      purchase_frequency: Number,
      user_rating: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
recommendationSchema.index({ user: 1, score: -1 });
recommendationSchema.index({ product: 1, score: -1 });
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to get recommendations for a user
recommendationSchema.statics.getRecommendationsForUser = async function(userId, limit = 10) {
  return this.find({ 
    user: userId, 
    isActive: true,
    expiresAt: { $gt: new Date() }
  })
  .populate('product', 'name description category price stock tags')
  .sort({ score: -1 })
  .limit(limit);
};

// Static method to create recommendation
recommendationSchema.statics.createRecommendation = async function(userId, productId, score, reason, metadata = {}) {
  // Check if recommendation already exists
  const existing = await this.findOne({ user: userId, product: productId });
  
  if (existing) {
    // Update existing recommendation
    existing.score = score;
    existing.reason = reason;
    existing.metadata = { ...existing.metadata, ...metadata };
    existing.isActive = true;
    existing.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return existing.save();
  } else {
    // Create new recommendation
    return this.create({
      user: userId,
      product: productId,
      score,
      reason,
      metadata,
    });
  }
};

module.exports = mongoose.model('Recommendation', recommendationSchema);