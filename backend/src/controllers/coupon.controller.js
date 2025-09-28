const Coupon = require('../models/coupon.model');

function computeDiscount(coupon, amount) {
  if (!coupon || !coupon.active) return { discount: 0, finalAmount: amount };
  if (coupon.type === 'percent') {
    const discount = Math.round((amount * coupon.value) / 100);
    return { discount, finalAmount: Math.max(0, amount - discount) };
  }
  if (coupon.type === 'fixed') {
    const discount = Math.min(amount, coupon.value);
    return { discount, finalAmount: Math.max(0, amount - discount) };
  }
  return { discount: 0, finalAmount: amount };
}

async function validateCoupon(req, res) {
  try {
    const code = String(req.query.code || '').toUpperCase().trim();
    const amount = Number(req.query.amount || 0);
    if (!code) return res.status(400).json({ message: 'code is required' });

    const coupon = await Coupon.findOne({ code });
    if (!coupon || !coupon.active) return res.status(404).json({ message: 'Invalid coupon' });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (amount && amount < (coupon.minAmount || 0)) return res.status(400).json({ message: `Minimum amount ${coupon.minAmount}` });

    const { discount, finalAmount } = computeDiscount(coupon, amount || 0);
    res.json({ code: coupon.code, type: coupon.type, value: coupon.value, minAmount: coupon.minAmount || 0, discount, finalAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { validateCoupon, computeDiscount };
