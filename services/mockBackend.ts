
import { User, Product, Order, UIConfig, Article, Banner } from '../types';

// Mock DB Storage
let MOCK_USERS: (User & { password?: string, permissions?: string[] })[] = [
  { id: '1', username: 'admin', name: 'OnlyBuyer Admin', role: 'admin', password: '040104', permissions: ['all'] },
  { id: '2', username: 'customer_demo', name: 'Khách Hàng Mẫu', role: 'customer', password: 'password123', phoneNumber: '0987654321', address: '72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh' },
  { id: '3', username: 'staff1', name: 'Nguyễn Văn Nhân Viên', role: 'staff', password: 'staff123', permissions: ['order_confirm', 'manage_products'], totalSales: 12, totalRevenue: 45000000 },
  { id: '4', username: 'staff2', name: 'Trần Thị Content', role: 'staff', password: 'staff123', permissions: ['post_article'], totalSales: 5, totalRevenue: 8000000 }
];

let MOCK_ARTICLES: Article[] = [
  { id: '1', title: 'Top 5 iPhone đáng mua nhất 2025', content: '<b>Nội dung in đậm</b> và danh sách...', authorId: '4', createdAt: new Date().toISOString(), thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21?w=500' }
];

let MOCK_ORDERS: Order[] = [];

// Default Data for initial experience
const DEFAULT_PRODUCTS: Product[] = [
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
    rating: 4.9, 
    sold: 1200 
  },
  { 
    id: 'p2', 
    name: 'MacBook Air M3', 
    price: 27990000, 
    category: 'Laptop', 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images. Reinhardt/photo-1611186871348-b1ec696e5237?w=500'
    ],
    description: 'Mỏng nhẹ, mạnh mẽ vượt trội với chip M3 thế hệ mới.', 
    rating: 4.8, 
    sold: 450 
  }
];

const DEFAULT_BANNERS: Banner[] = [
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
];

const DEFAULT_UI_CONFIG: UIConfig = {
  logoText: 'OnlyBuyer',
  slogan: 'Trải nghiệm mua sắm \n Hoàn toàn mới',
  primaryColor: '#2563eb',
  banners: DEFAULT_BANNERS,
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

// Logic tính hoa hồng
export const calculateCommission = (amount: number): number => {
  if (amount < 1000000) return amount * 0.15;
  if (amount < 10000000) return amount * 0.10;
  return amount * 0.05;
};

// Auth API Implementation
export const loginApi = async (username: string, pass: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === pass);
      if (user) {
        const { password, permissions, ...userWithoutSensitiveData } = user;
        resolve(userWithoutSensitiveData as User);
      } else {
        reject(new Error('Tên đăng nhập hoặc mật khẩu không chính xác'));
      }
    }, 500);
  });
};

export const registerApi = async (username: string, pass: string, name: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: any = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        name,
        role: 'customer' as const,
        password: pass
      };
      MOCK_USERS.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      resolve(userWithoutPassword);
    }, 500);
  });
};

export const socialLoginApi = async (provider: 'google' | 'facebook'): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mocking social login with a default customer for demo purposes
      const user = MOCK_USERS[1]; 
      const { password, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    }, 500);
  });
};

export const updateProfileApi = async (userId: string, data: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === userId);
      if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
        const { password, ...userWithoutPassword } = MOCK_USERS[index];
        resolve(userWithoutPassword);
      } else {
        reject(new Error('User not found'));
      }
    }, 500);
  });
};

// Staff API Implementation
export const getStaffListApi = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USERS.filter(u => u.role === 'staff' || u.role === 'admin')), 300);
  });
};

// Article API Implementation
export const saveArticleApi = async (article: Partial<Article>): Promise<void> => {
  return new Promise((resolve) => {
    const newArticle = {
      id: Math.random().toString(36).substr(2, 9),
      title: article.title || '',
      content: article.content || '',
      authorId: '1',
      createdAt: new Date().toISOString(),
      thumbnail: article.thumbnail || ''
    } as Article;
    MOCK_ARTICLES.push(newArticle);
    setTimeout(resolve, 500);
  });
};

export const getArticlesApi = async (): Promise<Article[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_ARTICLES]), 300));
};

// Product API Implementation
export const getProductsApi = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    const saved = localStorage.getItem('ob_products');
    setTimeout(() => resolve(saved ? JSON.parse(saved) : DEFAULT_PRODUCTS), 200);
  });
};

export const getProductByIdApi = async (id: string): Promise<Product | null> => {
  const products = await getProductsApi();
  return products.find(p => p.id === id) || null;
};

export const saveProductApi = async (product: Product): Promise<void> => {
  return new Promise((resolve) => {
    const saved = localStorage.getItem('ob_products');
    let products = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    const index = products.findIndex((p: any) => p.id === product.id);
    if (index !== -1) products[index] = product;
    else products.push(product);
    localStorage.setItem('ob_products', JSON.stringify(products));
    setTimeout(resolve, 500);
  });
};

// Order API Implementation
export const placeOrderApi = async (orderData: any): Promise<{ orderId: string }> => {
  return new Promise((resolve) => {
    const orderId = 'OB-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_ORDERS.push(newOrder);
    localStorage.setItem('ob_orders', JSON.stringify(MOCK_ORDERS));
    setTimeout(() => resolve({ orderId }), 800);
  });
};

export const getAllOrdersApi = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    const saved = localStorage.getItem('ob_orders');
    if (saved) MOCK_ORDERS = JSON.parse(saved);
    setTimeout(() => resolve([...MOCK_ORDERS]), 400);
  });
};

export const updateOrderStatusApi = async (orderId: string, status: Order['status']): Promise<void> => {
  return new Promise((resolve) => {
    const saved = localStorage.getItem('ob_orders');
    if (saved) MOCK_ORDERS = JSON.parse(saved);
    const index = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (index !== -1) {
      MOCK_ORDERS[index].status = status;
      localStorage.setItem('ob_orders', JSON.stringify(MOCK_ORDERS));
    }
    setTimeout(resolve, 500);
  });
};

// UI Config API Implementation
export const getUIConfigApi = async (): Promise<UIConfig> => {
  return new Promise((resolve) => {
    const saved = localStorage.getItem('ob_ui_config');
    setTimeout(() => resolve(saved ? JSON.parse(saved) : DEFAULT_UI_CONFIG), 300);
  });
};

export const saveUIConfigApi = async (config: UIConfig): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.setItem('ob_ui_config', JSON.stringify(config));
    setTimeout(resolve, 500);
  });
};
