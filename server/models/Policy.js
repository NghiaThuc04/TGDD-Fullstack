const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Lưu HTML từ Rich Text Editor
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
