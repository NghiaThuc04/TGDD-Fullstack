const mongoose = require('mongoose');

// Vì UIConfig có rất nhiều trường thiết lập (logo, color, banner, promo, info...)
// Để linh hoạt tối đa, ta dùng strict: false
const uiConfigSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton_config' } // Đảm bảo chỉ có 1 document
}, { strict: false });

module.exports = mongoose.model('UIConfig', uiConfigSchema);
