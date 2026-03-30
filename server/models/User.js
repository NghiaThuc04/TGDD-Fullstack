const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
  permissions: [{ type: String }],
  phoneNumber: { type: String },
  address: { type: String },
  avatar: { type: String },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('User', userSchema);
