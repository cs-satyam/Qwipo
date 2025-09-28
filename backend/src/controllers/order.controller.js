const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Create a new order
async function createOrder(req, res) {
  try {
    const { products } = req.body; // products = [{ product: productId, quantity: n }]
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    // Fetch product prices
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Product not found: ' + item.product });

      const price = product.price * item.quantity;
      totalAmount += price;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({
      retailer: req.user.userId,
      products: orderProducts,
      totalAmount
    });

    await order.save();
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
  deleteOrder
};
