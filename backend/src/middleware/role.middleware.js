function isRetailer(req, res, next) {
  try {
    const role = req.user?.role;
    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Retailer access required' });
    }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Access denied' });
  }
}

module.exports = { isRetailer };
