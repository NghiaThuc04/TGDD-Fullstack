const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String }, // Lưu trữ định dạng URL gọn (VD: iPhone17ProMax)
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String },
  specs: { type: String }, // Lưu văn bản thô Thông Số Kỹ Thuật
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  sold: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Product', productSchema);
