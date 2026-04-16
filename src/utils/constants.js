export const STORAGE_KEYS = {
  database: 'dokoxpress:mock-db',
  session: 'dokoxpress:auth-session',
};

export const PRODUCT_CATEGORIES = [
  'Groceries',
  'Electronics',
  'Beauty',
  'Home',
  'Bakery',
  'Beverages',
];

export const ORDER_STATUSES = [
  'Placed',
  'Packed',
  'Out for Delivery',
  'Delivered',
];

export const ROLE_LABELS = {
  user: 'Customer',
  vendor: 'Vendor',
  admin: 'Admin',
};

export const DASHBOARD_HOME = {
  user: '/user/products',
  vendor: '/vendor/products',
  admin: '/admin/overview',
};

export const LOCATION_OPTIONS = ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela'];

export const DEFAULT_PASSWORD_HINT = 'Password@123';
