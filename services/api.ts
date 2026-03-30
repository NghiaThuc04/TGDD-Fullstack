
/**
 * API Service — kết nối frontend với backend Express thực sự
 * Mọi request đều đến /api (được proxy tới localhost:3001 bởi Vite)
 */

import { User, Product, Order, UIConfig, Article } from '../types';

const BASE_URL = 'https://tgdd-fullstack.onrender.com/api';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getToken = (): string | null => localStorage.getItem('ob_jwt_token');

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).message || `Lỗi ${res.status}`);
  }
  return data as T;
};

const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  return handleResponse<T>(res);
};

// ─────────────────────────────────────────────
// Commission Logic (tính ở frontend, giống cũ)
// ─────────────────────────────────────────────
export const calculateCommission = (amount: number): number => {
  if (amount < 1000000) return amount * 0.15;
  if (amount < 10000000) return amount * 0.10;
  return amount * 0.05;
};

// ─────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────

export const loginApi = async (username: string, pass: string): Promise<User> => {
  const data = await apiFetch<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password: pass }),
  });
  localStorage.setItem('ob_jwt_token', data.token);
  return data.user;
};

export const registerApi = async (username: string, pass: string, name: string): Promise<User> => {
  const data = await apiFetch<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password: pass, name }),
  });
  localStorage.setItem('ob_jwt_token', data.token);
  return data.user;
};

export const socialLoginApi = async (_provider: 'google' | 'facebook'): Promise<User> => {
  // Social login chưa được triển khai — thay bằng thông báo
  throw new Error('SOCIAL_LOGIN_COMING_SOON');
};

export const updateProfileApi = async (userId: string, data: Partial<User>): Promise<User> => {
  return apiFetch<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      avatar: data.avatar,
    }),
  });
};

export const changePasswordApi = async (currentPassword: string, newPassword: string): Promise<void> => {
  await apiFetch('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

// ─────────────────────────────────────────────
// STAFF API
// ─────────────────────────────────────────────

export const getStaffListApi = async (): Promise<User[]> => {
  return apiFetch<User[]>('/staff');
};

// ─────────────────────────────────────────────
// ARTICLE API
// ─────────────────────────────────────────────

export const saveArticleApi = async (article: Partial<Article>): Promise<void> => {
  await apiFetch('/articles', {
    method: 'POST',
    body: JSON.stringify({
      title: article.title,
      content: article.content,
      thumbnail: article.thumbnail,
    }),
  });
};

export const getArticlesApi = async (): Promise<Article[]> => {
  return apiFetch<Article[]>('/articles');
};

// ─────────────────────────────────────────────
// PRODUCT API
// ─────────────────────────────────────────────

export const getProductsApi = async (): Promise<Product[]> => {
  return apiFetch<Product[]>('/products');
};

export const getProductByIdApi = async (id: string): Promise<Product | null> => {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch {
    return null;
  }
};

export const saveProductApi = async (product: Product): Promise<void> => {
  await apiFetch(`/products/${product.id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
};

// ─────────────────────────────────────────────
// ORDER API
// ─────────────────────────────────────────────

export const placeOrderApi = async (orderData: any): Promise<{ orderId: string }> => {
  return apiFetch<{ orderId: string }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getAllOrdersApi = async (): Promise<Order[]> => {
  return apiFetch<Order[]>('/orders');
};

export const updateOrderApi = async (orderId: string, data: {
  customerName?: string;
  customerPhone?: string;
  address?: string;
  paymentMethod?: string;
  transferProvider?: string;
}): Promise<Order> => {
  return apiFetch<Order>(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteOrderApi = async (orderId: string): Promise<void> => {
  await apiFetch(`/orders/${orderId}`, { method: 'DELETE' });
};

export const updateOrderStatusApi = async (orderId: string, status: Order['status']): Promise<void> => {
  await apiFetch(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// ─────────────────────────────────────────────
// STAFF CRUD API
// ─────────────────────────────────────────────

export const createStaffApi = async (data: {
  username: string; password: string; name: string;
  role: 'staff' | 'admin'; permissions?: string[];
}): Promise<User> => {
  return apiFetch<User>('/staff', { method: 'POST', body: JSON.stringify(data) });
};

export const updateStaffApi = async (id: string, data: Partial<User> & { password?: string }): Promise<User> => {
  return apiFetch<User>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteStaffApi = async (id: string): Promise<void> => {
  await apiFetch(`/staff/${id}`, { method: 'DELETE' });
};

export const getStaffActivitiesApi = async (id: string): Promise<any> => {
  return apiFetch<any>(`/staff/${id}/activities`);
};

// ─────────────────────────────────────────────
// UI CONFIG API
// ─────────────────────────────────────────────

export const getUIConfigApi = async (): Promise<UIConfig> => {
  return apiFetch<UIConfig>('/ui-config');
};

export const saveUIConfigApi = async (config: UIConfig): Promise<void> => {
  await apiFetch('/ui-config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
};
