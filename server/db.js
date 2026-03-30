const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Article = require('./models/Article');
const UIConfig = require('./models/UIConfig');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ CẢNH BÁO: Chưa cấu hình MONGO_URI trong file .env');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n🚀 KẾT NỐI MONGODB ATLAS THÀNH CÔNG!');
    
    // Tự động kiểm tra và bơm (seed) dữ liệu cũ
    await migrateDataFromJSON();
  } catch (error) {
    console.error('\n❌ LỖI KẾT NỐI MONGODB:', error.message);
    process.exit(1);
  }
};

/**
 * Hàm di chuyển toàn bộ dữ liệu từ cục bộ (server/data/*.json)
 * Lên thẳng MongoDB (nếu DB chưa có gì)
 */
const migrateDataFromJSON = async () => {
  try {
    const DATA_DIR = path.join(__dirname, 'data');
    if (!fs.existsSync(DATA_DIR)) return;

    // Check Users
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('🔄 Đang chuyển đổi Users lên Atlas...');
      const usersRaw = fs.readFileSync(path.join(DATA_DIR, 'users.json'), 'utf-8');
      const usersData = JSON.parse(usersRaw);
      await User.insertMany(usersData);
      console.log(`✅ Đã đồng bộ ${usersData.length} Users.`);
    }

    // Check Products
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      console.log('🔄 Đang chuyển đổi Products lên Atlas...');
      const productsRaw = fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf-8');
      const productsData = JSON.parse(productsRaw);
      await Product.insertMany(productsData);
      console.log(`✅ Đã đồng bộ ${productsData.length} Products.`);
    }

    // Check Orders
    const ordersCount = await Order.countDocuments();
    if (ordersCount === 0) {
      const ordersFile = path.join(DATA_DIR, 'orders.json');
      if (fs.existsSync(ordersFile)) {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
        if (ordersData.length > 0) {
          console.log('🔄 Đang chuyển đổi Orders lên Atlas...');
          // Ánh xạ (Map) các trường cũ sang chuẩn mới để khớp với Schema Order.js
          const mappedOrders = ordersData.map(o => ({
            ...o,
            customerId: o.userId || o.customerId, // JSON cũ dùng userId
            phoneNumber: o.customerPhone || o.phoneNumber || '000', // Cũ dùng customerPhone
            subtotal: o.subtotal || o.total, // JSON cũ không lưu subtotal
            shippingFee: o.shippingFee || 0
          }));
          await Order.insertMany(mappedOrders);
          console.log(`✅ Đã đồng bộ ${ordersData.length} Orders.`);
        }
      }
    }

    // Check Articles
    const articlesCount = await Article.countDocuments();
    if (articlesCount === 0) {
      const articlesFile = path.join(DATA_DIR, 'articles.json');
      if (fs.existsSync(articlesFile)) {
        const articlesData = JSON.parse(fs.readFileSync(articlesFile, 'utf-8'));
        if (articlesData.length > 0) {
           await Article.insertMany(articlesData);
           console.log(`✅ Đã đồng bộ ${articlesData.length} Articles.`);
        }
      }
    }

    // Check UIConfig
    const uiConfigCount = await UIConfig.countDocuments();
    if (uiConfigCount === 0) {
      const configFile = path.join(DATA_DIR, 'ui_config.json');
      if (fs.existsSync(configFile)) {
        const configData = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        console.log('🔄 Đang cấu hình giao diện lên Atlas...');
        const newConfig = new UIConfig({ ...configData, _id: 'singleton_config' });
        await newConfig.save();
        console.log(`✅ Đã dọn dẹp xong toàn bộ giao diện!`);
      }
    }

  } catch (error) {
    console.error('❌ Lỗi trong quá trình gộp dữ liệu JSON sang MongoDB:', error.message);
  }
};

const generateId = (prefix = '') =>
  prefix + Math.random().toString(36).substr(2, 9);

module.exports = { connectDB, generateId };
