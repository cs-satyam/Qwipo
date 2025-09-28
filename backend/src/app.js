// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const recommendationRoutes = require('./routes/recommendation.routes');


// Initialize app
const app = express();

// Middleware

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));
app.use(express.json()); // Parse JSON body
app.use(morgan("dev"));
app.use(helmet()); // Security headers

// Rate limiting (basic)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to the Auth API');
});

module.exports = app;
