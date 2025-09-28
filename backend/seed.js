const mongoose = require('mongoose');
const Product = require('./src/models/product.model');
const products = require('./data/products.json');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    await Product.deleteMany(); // optional: remove existing products
    await Product.insertMany(products); // insert products from JSON
    
    console.log('Products added successfully');
    process.exit();
  })
  .catch(err => console.log(err));
