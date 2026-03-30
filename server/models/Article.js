const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Article', articleSchema);
