// ─── LocalStorage Keys ───
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'ob_jwt_token',
  AUTH_USER: 'ob_auth_user',
  PRODUCTS: 'ob_products',
  ORDERS: 'ob_orders',
  UI_CONFIG: 'ob_ui_config',
  CART: 'ob_cart',
};

// ─── User Roles ───
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const;

// ─── Commission tiers (business logic) ───
export const COMMISSION_RATES = {
  TIER_1: { THRESHOLD: 1_000_000, RATE: 0.15 },
  TIER_2: { THRESHOLD: 10_000_000, RATE: 0.10 },
  DEFAULT_RATE: 0.05,
};

// ─── Vite proxy target (dev only) ───
export const DEV_PROXY_TARGET = 'http://localhost:5000';
