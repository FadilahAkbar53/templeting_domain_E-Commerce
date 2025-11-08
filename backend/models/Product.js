// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [{ type: Number }],
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);