const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');
const { computeDiscount } = require('./coupon.controller');

// Create a new order
async function createOrder(req, res) {
  try {
    const { products, couponCode, shipping } = req.body; // products = [{ product: productId, quantity: n }]
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }
    if (!shipping || !shipping.name || !shipping.address) {
      return res.status(400).json({ message: 'Shipping name and address are required' });
    }

    // Fetch product prices
    let subtotal = 0;
    const orderProducts = [];

    // Validate stock and build order lines
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Product not found: ' + item.product });
      const qty = Number(item.quantity) || 1;
      if (product.stock < qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
      subtotal += product.price * qty;
      orderProducts.push({ product: product._id, quantity: qty, price: product.price });
    }

    // Apply coupon if provided
    let discount = 0;
    let appliedCode = undefined;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });
      if (!coupon) return res.status(400).json({ message: 'Invalid coupon code' });
      if (!coupon.active) return res.status(400).json({ message: 'Coupon is inactive' });
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ message: 'Coupon expired' });
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
      if (coupon.minAmount && subtotal < coupon.minAmount) return res.status(400).json({ message: `Minimum amount ${coupon.minAmount}` });
      const calc = computeDiscount(coupon, subtotal);
      discount = calc.discount || 0;
      appliedCode = coupon.code;
    }

    const totalAmount = Math.max(0, subtotal - discount);

    const order = new Order({
      retailer: req.user.userId,
      products: orderProducts,
      totalAmount,
      discount,
      couponCode: appliedCode,
      shipping: {
        name: String(shipping.name || ''),
        phone: String(shipping.phone || ''),
        address: String(shipping.address || ''),
        city: String(shipping.city || ''),
        state: String(shipping.state || ''),
        zip: String(shipping.zip || ''),
      },
    });

    await order.save();

    // Decrement stock
    for (const line of orderProducts) {
      await Product.findByIdAndUpdate(line.product, { $inc: { stock: -line.quantity } });
    }

    // Increment coupon usage
    if (appliedCode) {
      await Coupon.updateOne({ code: appliedCode }, { $inc: { usedCount: 1 } });
    }
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all orders for logged-in retailer
async function getOrders(req, res) {
  try {
    const orders = await Order.find({ retailer: req.user.userId }).populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get order by ID
async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('products.product', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure the order belongs to logged-in retailer
    if (order.retailer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update order status
async function updateOrder(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    await order.save();
    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete order (cancel)
async function deleteOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only retailer who created order can delete
    if (order.retailer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await order.deleteOne();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  // New export below will be defined after
};

// Get orders that include products listed by the logged-in retailer
async function getSalesOrders(req, res) {
  try {
    const retailerId = req.user.userId;
    // Aggregate orders joining product to access distributor
    const orders = await Order.aggregate([
      { $unwind: '$products' },
      { $lookup: { from: 'products', localField: 'products.product', foreignField: '_id', as: 'prod' } },
      { $unwind: '$prod' },
      { $match: { 'prod.distributor': require('mongoose').Types.ObjectId.createFromHexString(retailerId) } },
      { $group: {
          _id: '$_id',
          doc: { $first: '$$ROOT' },
          products: { $push: '$products' }
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { products: '$products' }] } } },
      { $sort: { createdAt: -1 } }
    ]);
    // Optionally repopulate product details
    // Note: aggregation strips virtuals; client can fetch product info by id if needed
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports.getSalesOrders = getSalesOrders;
