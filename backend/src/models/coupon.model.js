const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true }, // percent (e.g., 10) or fixed amount (e.g., 100)
    active: { type: Boolean, default: true },
    minAmount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
