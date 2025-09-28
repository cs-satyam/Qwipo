const Cart = require('../models/cart.model');

// Ensure user cart exists
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image thumbnail');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate('items.product', 'name price image thumbnail');
  }
  return cart;
}

// GET /api/cart
async function getCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user.userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/cart/add { product, quantity }
async function addItem(req, res) {
  try {
    const { product, quantity = 1 } = req.body;
    if (!product) return res.status(400).json({ message: 'product is required' });
    const cart = await getOrCreateCart(req.user.userId);
    const idx = cart.items.findIndex(i => i.product.toString() === product);
    if (idx >= 0) {
      cart.items[idx].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({ product, quantity: Number(quantity) || 1 });
    }
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product', 'name price image thumbnail');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// PUT /api/cart/item { product, quantity }
async function updateItem(req, res) {
  try {
    const { product, quantity } = req.body;
    if (!product || typeof quantity !== 'number') return res.status(400).json({ message: 'product and quantity required' });
    const cart = await getOrCreateCart(req.user.userId);
    const idx = cart.items.findIndex(i => i.product.toString() === product);
    if (idx < 0) return res.status(404).json({ message: 'Item not in cart' });
    cart.items[idx].quantity = Math.max(1, quantity);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product', 'name price image thumbnail');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// DELETE /api/cart/item/:productId
async function removeItem(req, res) {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.userId);
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product', 'name price image thumbnail');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// DELETE /api/cart/clear
async function clearCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user.userId);
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
