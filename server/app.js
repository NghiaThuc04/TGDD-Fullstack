require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readTable, writeTable, readConfig, writeConfig, generateId } = require('./db');
const { protect, adminOnly, staffOrAdmin, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }

  const users = readTable('users');
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _p, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  const users = readTable('users');
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại' });
  }

  const newUser = {
    id: generateId(),
    username,
    password: bcrypt.hashSync(password, 10),
    name,
    role: 'customer',
    permissions: [],
    totalSales: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeTable('users', users);

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _p, ...safeUser } = newUser;
  res.status(201).json({ token, user: safeUser });
});

// GET /api/auth/profile
app.get('/api/auth/profile', protect, (req, res) => {
  const users = readTable('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
  const { password: _p, ...safeUser } = user;
  res.json(safeUser);
});

// PUT /api/auth/profile
app.put('/api/auth/profile', protect, (req, res) => {
  const { name, phoneNumber, address, avatar } = req.body;
  const users = readTable('users');
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Người dùng không tồn tại' });

  if (name !== undefined) users[idx].name = name;
  if (phoneNumber !== undefined) users[idx].phoneNumber = phoneNumber;
  if (address !== undefined) users[idx].address = address;
  if (avatar !== undefined) users[idx].avatar = avatar;

  writeTable('users', users);
  const { password: _p, ...safeUser } = users[idx];
  res.json(safeUser);
});

// PUT /api/auth/change-password
app.put('/api/auth/change-password', protect, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  const users = readTable('users');
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Người dùng không tồn tại' });

  if (!bcrypt.compareSync(currentPassword, users[idx].password)) {
    return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
  }

  users[idx].password = bcrypt.hashSync(newPassword, 10);
  writeTable('users', users);
  res.json({ message: 'Đổi mật khẩu thành công' });
});

// ─────────────────────────────────────────────
// PRODUCT ROUTES
// ─────────────────────────────────────────────

// GET /api/products
app.get('/api/products', (req, res) => {
  let products = readTable('products');
  const { category, search } = req.query;

  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  products.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  res.json(products);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const products = readTable('products');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  res.json(product);
});

// PUT /api/products/:id — upsert (create or update), Admin only
app.put('/api/products/:id', protect, adminOnly, (req, res) => {
  const products = readTable('products');
  const idx = products.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    // Create new
    const newProduct = { ...req.body, id: req.params.id, createdAt: new Date().toISOString() };
    products.push(newProduct);
  } else {
    // Update existing, preserve id and createdAt
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
  }

  writeTable('products', products);
  const saved = products.find(p => p.id === req.params.id);
  res.json(saved);
});

// DELETE /api/products/:id — Admin only
app.delete('/api/products/:id', protect, adminOnly, (req, res) => {
  const products = readTable('products');
  writeTable('products', products.filter(p => p.id !== req.params.id));
  res.json({ message: 'Đã xóa sản phẩm' });
});

// ─────────────────────────────────────────────
// ORDER ROUTES
// ─────────────────────────────────────────────

// GET /api/orders
app.get('/api/orders', protect, (req, res) => {
  const orders = readTable('orders');
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    return res.json([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }
  const mine = orders.filter(o => o.userId === req.user.id);
  res.json([...mine].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST /api/orders
app.post('/api/orders', protect, (req, res) => {
  const { items, total, address, customerName, customerPhone, paymentMethod, transferProvider } = req.body;

  if (!items || !total || !address) {
    return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
  }

  const orderId = 'OB-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    userId: req.user.id,
    items,
    total,
    status: 'pending',
    paymentMethod,
    transferProvider: transferProvider || undefined,
    customerName,
    customerPhone,
    address,
    createdAt: new Date().toISOString()
  };

  const orders = readTable('orders');
  orders.push(newOrder);
  writeTable('orders', orders);

  // Cập nhật sold count
  const products = readTable('products');
  for (const item of items) {
    const pidx = products.findIndex(p => p.id === item.id);
    if (pidx !== -1) products[pidx].sold = (products[pidx].sold || 0) + item.quantity;
  }
  writeTable('products', products);

  res.status(201).json({ orderId });
});

// PUT /api/orders/:id — Admin/Staff only (chỉnh sửa thông tin đơn hàng)
app.put('/api/orders/:id', protect, staffOrAdmin, (req, res) => {
  const { customerName, customerPhone, address, paymentMethod, transferProvider } = req.body;

  const orders = readTable('orders');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

  if (customerName !== undefined) orders[idx].customerName = customerName;
  if (customerPhone !== undefined) orders[idx].customerPhone = customerPhone;
  if (address !== undefined) orders[idx].address = address;
  if (paymentMethod !== undefined) orders[idx].paymentMethod = paymentMethod;
  if (transferProvider !== undefined) orders[idx].transferProvider = transferProvider;

  writeTable('orders', orders);
  res.json(orders[idx]);
});

// PUT /api/orders/:id/status — Admin/Staff only
app.put('/api/orders/:id/status', protect, staffOrAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'paid', 'shipping', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
  }

  const orders = readTable('orders');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

  orders[idx].status = status;
  writeTable('orders', orders);
  res.json({ message: 'Cập nhật trạng thái thành công' });
});

// DELETE /api/orders/:id — Admin only
app.delete('/api/orders/:id', protect, adminOnly, (req, res) => {
  const orders = readTable('orders');
  const exists = orders.find(o => o.id === req.params.id);
  if (!exists) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  writeTable('orders', orders.filter(o => o.id !== req.params.id));
  res.json({ message: 'Đã xóa đơn hàng' });
});

// ─────────────────────────────────────────────
// STAFF ROUTES
// ─────────────────────────────────────────────

// GET /api/staff — Admin only
app.get('/api/staff', protect, adminOnly, (req, res) => {
  const users = readTable('users');
  const staff = users
    .filter(u => u.role === 'staff' || u.role === 'admin')
    .map(({ password: _p, ...u }) => u);
  res.json(staff);
});

// POST /api/staff — Admin only (tạo nhân viên mới)
app.post('/api/staff', protect, adminOnly, (req, res) => {
  const { username, password, name, role, permissions } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }
  if (!['staff', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role không hợp lệ (staff/admin)' });
  }

  const users = readTable('users');
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại' });
  }

  const newUser = {
    id: generateId(),
    username,
    password: bcrypt.hashSync(password, 10),
    name,
    role: role || 'staff',
    permissions: permissions || [],
    totalSales: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeTable('users', users);
  const { password: _p, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// PUT /api/staff/:id — Admin only (cập nhật nhân viên)
app.put('/api/staff/:id', protect, adminOnly, (req, res) => {
  const { name, username, password, role, permissions, totalSales, totalRevenue } = req.body;
  const users = readTable('users');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Nhân viên không tồn tại' });

  if (name !== undefined) users[idx].name = name;
  if (username !== undefined) users[idx].username = username;
  if (password) users[idx].password = bcrypt.hashSync(password, 10);
  if (role !== undefined) users[idx].role = role;
  if (permissions !== undefined) users[idx].permissions = permissions;
  if (totalSales !== undefined) users[idx].totalSales = totalSales;
  if (totalRevenue !== undefined) users[idx].totalRevenue = totalRevenue;

  writeTable('users', users);
  const { password: _p, ...safeUser } = users[idx];
  res.json(safeUser);
});

// DELETE /api/staff/:id — Admin only
app.delete('/api/staff/:id', protect, adminOnly, (req, res) => {
  // Không cho xóa admin đang đăng nhập
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Không thể xóa tài khoản của chính mình' });
  }
  const users = readTable('users');
  const target = users.find(u => u.id === req.params.id);
  if (!target) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
  if (!['staff', 'admin'].includes(target.role)) {
    return res.status(400).json({ message: 'Chỉ có thể xóa tài khoản staff/admin' });
  }
  writeTable('users', users.filter(u => u.id !== req.params.id));
  res.json({ message: 'Đã xóa nhân viên' });
});

// ─────────────────────────────────────────────
// ARTICLE ROUTES
// ─────────────────────────────────────────────

// GET /api/articles
app.get('/api/articles', (req, res) => {
  const articles = readTable('articles');
  res.json([...articles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST /api/articles — Staff/Admin only
app.post('/api/articles', protect, staffOrAdmin, (req, res) => {
  const { title, content, thumbnail } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Vui lòng nhập tiêu đề và nội dung bài viết' });
  }

  const newArticle = {
    id: generateId(),
    title,
    content,
    authorId: req.user.id,
    thumbnail: thumbnail || undefined,
    createdAt: new Date().toISOString()
  };

  const articles = readTable('articles');
  articles.push(newArticle);
  writeTable('articles', articles);
  res.status(201).json({ id: newArticle.id, message: 'Đăng bài thành công' });
});

// ─────────────────────────────────────────────
// UI CONFIG ROUTES
// ─────────────────────────────────────────────

// GET /api/ui-config
app.get('/api/ui-config', (req, res) => {
  const config = readConfig();
  if (!config) return res.status(404).json({ message: 'Cấu hình chưa được thiết lập' });
  res.json(config);
});

// POST /api/ui-config — Admin only
app.post('/api/ui-config', protect, adminOnly, (req, res) => {
  writeConfig(req.body);
  res.json({ message: 'Lưu cấu hình thành công' });
});

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'OnlyBuyer API Server đang hoạt động 🚀',
    timestamp: new Date().toISOString()
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 OnlyBuyer API Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📦 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📋 Tài khoản mặc định:`);
  console.log(`   Admin  → username: admin          | password: 040104`);
  console.log(`   Staff  → username: staff1          | password: staff123`);
  console.log(`   Khách  → username: customer_demo   | password: password123\n`);
});
