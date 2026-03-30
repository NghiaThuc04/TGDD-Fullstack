const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  sold: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Product', productSchema);
