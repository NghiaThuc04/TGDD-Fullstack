
export type Role = 'admin' | 'customer' | 'staff';

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: Role;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  totalSales?: number;
  totalRevenue?: number;
  permissions?: string[];
}

export interface UIConfig {
  logoText: string;
  slogan: string;
  primaryColor: string;
  banners: Banner[];
  promoCard1Title: string;
  promoCard1Subtitle: string;
  promoCard1Image: string;
  promoCard2Title: string;
  promoCard2Subtitle: string;
  showBanner: boolean;
  showCategories: boolean;
  showFeaturedProducts: boolean;
  categories: CategoryConfig[];
}

export interface Product {
  id: string;
  slug?: string; // Đoạn mã thân thiện URL (VD: iPhone17ProMax)
  name: string;
  price: number;
  category: string;
  image: string; // Ảnh chính
  images: string[]; // Danh sách ảnh mô tả chi tiết
  description: string;
  specs?: string; // Bảng thông số kỹ thuật dạng Text thô
  stock?: number; // Tùy chọn, sẽ ẩn ở UI theo yêu cầu
  rating: number;
  sold: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled';
  createdAt: string;
  address: string;
  paymentMethod: 'COD' | 'Transfer';
  transferProvider?: 'Momo' | 'VNPay';
  customerPhone?: string;
  customerName?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  thumbnail?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
