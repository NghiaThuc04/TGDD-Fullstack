const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipping', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Order', orderSchema);
