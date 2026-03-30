/**
 * JSON File-based Database
 * Thay thế SQLite bằng file JSON đơn giản, không cần native compilation.
 * Data được lưu tại server/data/*.json và persist qua các lần restart.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─────────────────────────────────────────────
// JSON File Helpers
// ─────────────────────────────────────────────
const readTable = (name) => {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
};

const writeTable = (name, data) => {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const readConfig = () => {
  const filePath = path.join(DATA_DIR, 'ui_config.json');
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
};

const writeConfig = (config) => {
  const filePath = path.join(DATA_DIR, 'ui_config.json');
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
};

// ─────────────────────────────────────────────
// Seed Default Data (chỉ chạy lần đầu)
// ─────────────────────────────────────────────

// Users
if (readTable('users').length === 0) {
  const users = [
    {
      id: '1',
      username: 'admin',
      password: bcrypt.hashSync('040104', 10),
      name: 'OnlyBuyer Admin',
      role: 'admin',
      permissions: ['all'],
      totalSales: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      username: 'customer_demo',
      password: bcrypt.hashSync('password123', 10),
      name: 'Khách Hàng Mẫu',
      role: 'customer',
      permissions: [],
      phoneNumber: '0987654321',
      address: '72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh',
      totalSales: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      username: 'staff1',
      password: bcrypt.hashSync('staff123', 10),
      name: 'Nguyễn Văn Nhân Viên',
      role: 'staff',
      permissions: ['order_confirm', 'manage_products'],
      totalSales: 12,
      totalRevenue: 45000000,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      username: 'staff2',
      password: bcrypt.hashSync('staff123', 10),
      name: 'Trần Thị Content',
      role: 'staff',
      permissions: ['post_article'],
      totalSales: 5,
      totalRevenue: 8000000,
      createdAt: new Date().toISOString()
    }
  ];
  writeTable('users', users);
  console.log('✅ Seeded default users');
}

// Products
if (readTable('products').length === 0) {
  const products = [
    {
      id: 'p1',
      name: 'iPhone 15 Pro Max',
      price: 29990000,
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d256e?w=500',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d256e?w=500',
        'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500',
        'https://images.unsplash.com/photo-1695048542132-7f1396f6b0f1?w=500'
      ],
      description: 'Siêu phẩm Apple 2024 với chip A17 Pro mạnh mẽ.',
      stock: 50,
      rating: 4.9,
      sold: 1200,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2',
      name: 'MacBook Air M3',
      price: 27990000,
      category: 'Laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?w=500'
      ],
      description: 'Mỏng nhẹ, mạnh mẽ vượt trội với chip M3 thế hệ mới.',
      stock: 30,
      rating: 4.8,
      sold: 450,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p3',
      name: 'Samsung Galaxy S24 Ultra',
      price: 26990000,
      category: 'Điện thoại',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
      description: 'Flagship Samsung với bút S Pen tích hợp và camera 200MP.',
      stock: 25,
      rating: 4.7,
      sold: 820,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p4',
      name: 'AirPods Pro 2nd Gen',
      price: 6490000,
      category: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
      images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500'],
      description: 'Chống ồn chủ động thế hệ mới, âm bass sâu, pin 30 giờ.',
      stock: 100,
      rating: 4.9,
      sold: 3200,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p5',
      name: 'Apple Watch Series 9',
      price: 11990000,
      category: 'Đồng hồ',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
      description: 'Smartwatch thông minh nhất với chip S9, màn hình luôn sáng.',
      stock: 40,
      rating: 4.8,
      sold: 960,
      createdAt: new Date().toISOString()
    }
  ];
  writeTable('products', products);
  console.log('✅ Seeded default products');
}

// Orders
if (!fs.existsSync(path.join(DATA_DIR, 'orders.json'))) {
  writeTable('orders', []);
}

// Articles
if (!fs.existsSync(path.join(DATA_DIR, 'articles.json'))) {
  writeTable('articles', [
    {
      id: 'a1',
      title: 'Top 5 iPhone đáng mua nhất 2025',
      content: '<b>Nội dung in đậm</b> và danh sách...',
      authorId: '4',
      thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21?w=500',
      createdAt: new Date().toISOString()
    }
  ]);
}

// UI Config
if (!readConfig()) {
  const defaultConfig = {
    logoText: 'OnlyBuyer',
    slogan: 'Trải nghiệm mua sắm\nHoàn toàn mới',
    primaryColor: '#2563eb',
    banners: [
      {
        id: 'b1',
        title: 'Trải nghiệm mua sắm\nHoàn toàn mới',
        subtitle: 'MỚI RA MẮT',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600',
        ctaText: 'Săn Deal Ngay',
        ctaLink: '#',
        isActive: true
      },
      {
        id: 'b2',
        title: 'Siêu Phẩm Apple\nMacBook M3 Series',
        subtitle: 'CẤU HÌNH KHỦNG',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600',
        ctaText: 'Khám Phá Ngay',
        ctaLink: '#',
        isActive: true
      },
      {
        id: 'b3',
        title: 'Phụ Kiện Thông Minh\nĐón Đầu Xu Hướng',
        subtitle: 'GIẢM GIÁ 30%',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600',
        ctaText: 'Mua Ngay',
        ctaLink: '#',
        isActive: true
      }
    ],
    promoCard1Title: 'SNEAKER\nCOLLECTION',
    promoCard1Subtitle: 'Giảm 200k đơn đầu',
    promoCard1Image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    promoCard2Title: 'Thời trang\nXU HƯỚNG',
    promoCard2Subtitle: '#Streetwear2025',
    showBanner: true,
    showCategories: true,
    showFeaturedProducts: true,
    categories: [
      { id: 'c1', name: 'Điện thoại', icon: '📱' },
      { id: 'c2', name: 'Laptop', icon: '💻' },
      { id: 'c3', name: 'Quần áo', icon: '👕' },
      { id: 'c4', name: 'Giày dép', icon: '👟' },
      { id: 'c5', name: 'Đồng hồ', icon: '⌚' },
      { id: 'c6', name: 'Phụ kiện', icon: '🎧' }
    ]
  };
  writeConfig(defaultConfig);
  console.log('✅ Seeded default UI config');
}

// ─────────────────────────────────────────────
// ID Generator
// ─────────────────────────────────────────────
const generateId = (prefix = '') =>
  prefix + Math.random().toString(36).substr(2, 9);

module.exports = { readTable, writeTable, readConfig, writeConfig, generateId };
