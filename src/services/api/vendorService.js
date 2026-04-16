import { apiClient } from './client';
import { readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getVendorProducts(vendorId) {
  if (!USE_MOCKS) {
    const response = await apiClient.get(`/vendors/${vendorId}/products`);
    return response.data;
  }

  return simulateNetwork(
    () =>
      readMockDatabase()
        .products.filter((product) => product.vendorId === vendorId)
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    280,
  );
}

export async function upsertVendorProduct(vendorId, payload) {
  return simulateNetwork(() => {
    const vendorIdStr = String(vendorId);
    const updated = updateMockDatabase((database) => {
      // Find vendor - could be in mock DB or be a real backend user (not in mock DB)
      const vendor = database.vendors.find((entry) => String(entry.id) === vendorIdStr);
      // Use storeName if vendor exists in mock DB, otherwise fallback gracefully
      const vendorName = vendor?.storeName ?? payload.storeName ?? 'My Store';

      const existing = payload.id
        ? database.products.find((product) => product.id === payload.id && String(product.vendorId) === vendorIdStr)
        : undefined;

      const nextProduct = existing
        ? {
            ...existing,
            ...payload,
            vendorId: vendorIdStr,
            vendorName,
          }
        : {
            id: createId('prd'),
            vendorId: vendorIdStr,
            vendorName,
            createdAt: new Date().toISOString(),
            ...payload,
          };

      const products = payload.id
        ? database.products.map((product) => (product.id === payload.id ? nextProduct : product))
        : [nextProduct, ...database.products];

      return {
        ...database,
        products,
      };
    });

    return updated.products.filter((product) => String(product.vendorId) === vendorIdStr);
  }, 650);
}

export async function deleteVendorProduct(vendorId, productId) {
  const vendorIdStr = String(vendorId);
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      products: database.products.filter(
        (product) => !(String(product.vendorId) === vendorIdStr && product.id === productId)
      ),
    }));

    return updated.products.filter((product) => String(product.vendorId) === vendorIdStr);
  }, 420);
}

export async function getVendorOrders(vendorId) {
  return simulateNetwork(
    () =>
      readMockDatabase()
        .orders.filter((order) => order.vendorId === vendorId)
        .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime()),
    320,
  );
}

export async function updateVendorOrderStatus(vendorId, orderId, status) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      orders: database.orders.map((order) =>
        order.id === orderId && order.vendorId === vendorId ? { ...order, status } : order,
      ),
    }));

    return updated.orders.filter((order) => order.vendorId === vendorId);
  }, 450);
}

export async function updateVendorProfile(vendorId, updates) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      vendors: database.vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, ...updates } : vendor)),
    }));

    const vendor = updated.vendors.find((entry) => entry.id === vendorId);

    if (!vendor) {
      throw new Error('Vendor profile not found.');
    }

    return stripPassword(vendor);
  }, 500);
}
