require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB, generateId } = require('./db');
const { protect, adminOnly, staffOrAdmin, JWT_SECRET } = require('./middleware/auth');

// MongoDB Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Article = require('./models/Article');
const UIConfig = require('./models/UIConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối Internet tới MongoDB đám mây
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });

    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Tên hoặc mật khẩu sai' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ token, user: safeUser });
  } catch (error) { res.status(500).json({ message: 'Lỗi DB' }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại' });

    const newUser = new User({
      id: generateId(),
      username,
      password: bcrypt.hashSync(password, 10),
      name
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const safeUser = newUser.toObject();
    delete safeUser.password;
    res.status(201).json({ token, user: safeUser });
  } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
});

app.get('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tồn tại' });
    res.json(user);
  } catch (error) { res.status(500).json({ message: 'Lỗi DB' }); }
});

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const { name, phoneNumber, address, avatar } = req.body;
    const user = await User.findOne({ id: req.user.id });
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (error) { res.status(500).json({ message: 'Lỗi DB' }); }
});

app.put('/api/auth/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ id: req.user.id });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ message: 'Mật khẩu sai' });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) { res.status(500).json({ message: 'Lỗi DB' }); }
});

// ─────────────────────────────────────────────
// PRODUCT & ORDER ROUTES
// ─────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { description: regex }];
    }
    const products = await Product.find(query).sort({ sold: -1 });
    res.json(products);
  } catch(e) { res.status(500).json({ message: 'Lỗi' }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }]
    });
    if (!product) return res.status(404).json({ message: 'Không thấy' });
    res.json(product);
  } catch(e) { res.status(500).json({ message: 'Lỗi' }); }
});

app.put('/api/products/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, id: req.params.id },
      { new: true, upsert: true }
    );
    res.json(product);
  } catch(e) { res.status(500).json({ message: 'Lỗi' }); }
});

app.delete('/api/products/:id', protect, adminOnly, async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Đã xóa' });
});

app.get('/api/orders', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      // Đối với db cũ userId = req.user.id, ta đổi thành OR vì JSON có thể có 2 loại
      query.$or = [{ customerId: req.user.id }, { userId: req.user.id }];
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch(e) { res.status(500).json({ message: 'Lỗi' }); }
});

app.post('/api/orders', protect, async (req, res) => {
  try {
    const { items, total, address, customerName, customerPhone, paymentMethod, transferProvider, subtotal, shippingFee } = req.body;
    const orderId = 'OB-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = new Order({
      id: orderId,
      customerId: req.user.id,
      items, total, address,
      customerName, phoneNumber: customerPhone,
      paymentMethod, transferProvider, subtotal: subtotal || total, shippingFee: shippingFee || 0
    });
    
    await newOrder.save();

    for (const item of items) {
       // Cập nhật lượt bán
       await Product.findOneAndUpdate({ id: item.id || item.productId }, { $inc: { sold: item.quantity } });
    }
    res.status(201).json({ orderId });
  } catch(e) { res.status(500).json({ message: 'Lỗi', e }); }
});

app.put('/api/orders/:id/status', protect, staffOrAdmin, async (req, res) => {
  try {
    const payload = { status: req.body.status };
    // Nếu đổi sang Đang giao (shipping) hoặc Hoàn thành (completed), ghi danh người xử lý
    if (req.body.status === 'shipping' || req.body.status === 'completed') {
      payload.handlerId = req.user.id;
    }
    const order = await Order.findOneAndUpdate({ id: req.params.id }, payload, { new: true });
    res.json({ message: 'Đã cập nhật' });
  } catch(e) { res.status(500).json({ message: 'Lỗi server' }); }
});

app.delete('/api/orders/:id', protect, adminOnly, async (req, res) => {
  await Order.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Đã xóa' });
});

// ─────────────────────────────────────────────
// STAFF & ARTICLES & UI
// ─────────────────────────────────────────────

app.get('/api/staff/:id/activities', protect, adminOnly, async (req, res) => {
  try {
    const staffId = req.params.id;
    // Tìm đơn hàng do nhân viên này chốt (chuyển sang shipping/completed)
    const handledOrders = await Order.find({ handlerId: staffId }).sort({ createdAt: -1 });
    // Tìm bài viết do nhân viên này đăng
    const articles = await Article.find({ authorId: staffId }).sort({ createdAt: -1 });
    
    const totalSales = handledOrders.reduce((acc, current) => acc + current.total, 0);
    const totalProductsSold = handledOrders.reduce((acc, current) => {
       return acc + current.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);

    res.json({
      handledOrders,
      articles,
      stats: {
        totalOrders: handledOrders.length,
        totalSales,
        totalProductsSold,
        totalArticles: articles.length
      }
    });
  } catch(e) { res.status(500).json({ message: 'Lỗi lấy báo cáo hoạt động' }); }
});

app.get('/api/staff', protect, adminOnly, async (req, res) => {
  const staff = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-password');
  res.json(staff);
});

app.post('/api/staff', protect, adminOnly, async (req, res) => {
  const { username, password, name, role, permissions } = req.body;
  const newUser = new User({
    id: generateId(), username, name, role: role || 'staff', permissions,
    password: bcrypt.hashSync(password, 10)
  });
  await newUser.save();
  res.status(201).json(newUser);
});

app.put('/api/staff/:id', protect, adminOnly, async (req, res) => {
  const data = { ...req.body };
  if(data.password) data.password = bcrypt.hashSync(data.password, 10);
  const u = await User.findOneAndUpdate({ id: req.params.id }, data, { new: true }).select('-password');
  res.json(u);
});

app.delete('/api/staff/:id', protect, adminOnly, async (req, res) => {
  await User.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Đã xóa' });
});

app.get('/api/articles', async (req, res) => {
  res.json(await Article.find().sort({ createdAt: -1 }));
});

app.get('/api/ui-config', async (req, res) => {
  const c = await UIConfig.findOne({ _id: 'singleton_config' });
  res.json(c || {});
});

app.post('/api/ui-config', protect, adminOnly, async (req, res) => {
  await UIConfig.findOneAndUpdate({ _id: 'singleton_config' }, { ...req.body }, { upsert: true, strict: false });
  res.json({ message: 'Lưu config' });
});

// STATIC & HEALTH
app.get('/api/health', (req, res) => res.json({ status: 'ok', msg: 'System is connected to Atlas!' }));
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

app.listen(PORT, () => console.log('\n🚀 Express Mongoose Server Live: http://localhost:' + PORT));
