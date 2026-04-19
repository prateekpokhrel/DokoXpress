import { apiClient } from './client';
import { readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = false;

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getVendorProducts(vendorId) {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/products');
    return response.data
      .filter((p) => String(p.vendorId) === String(vendorId))
      .map((p) => ({
        ...p,
        id: String(p.id),
        vendorId: String(p.vendorId),
        status: p.status?.toLowerCase() ?? 'active',
        image: p.imageUrl ?? p.image ?? null,
        isFastDelivery: p.isFastDelivery ?? false,
        createdAt: p.createdAt ?? new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  if (!USE_MOCKS) {
    const body = {
      vendorId: Number(vendorId),
      name: payload.name,
      description: payload.description ?? '',
      price: payload.price,
      stock: payload.stock ?? 0,
      category: payload.category ?? '',
      status: (payload.status ?? 'active').toUpperCase(),
      imageUrl: payload.image ?? payload.imageUrl ?? null,
    };
    if (payload.id) {
      // Update existing product
      await apiClient.put(`/products/${payload.id}`, body);
    } else {
      await apiClient.post('/products', body);
    }
    // Return updated list for this vendor
    const response = await apiClient.get('/products');
    return response.data
      .filter((p) => String(p.vendorId) === String(vendorId))
      .map((p) => ({
        ...p,
        id: String(p.id),
        vendorId: String(p.vendorId),
        status: p.status?.toLowerCase() ?? 'active',
        image: p.imageUrl ?? p.image ?? null,
        isFastDelivery: false,
        createdAt: p.createdAt ?? new Date().toISOString(),
      }));
  }

  return simulateNetwork(() => {
    const vendorIdStr = String(vendorId);
    const updated = updateMockDatabase((database) => {
      const vendor = database.vendors.find((entry) => String(entry.id) === vendorIdStr);
      const vendorName = vendor?.storeName ?? payload.storeName ?? 'My Store';

      const existing = payload.id
        ? database.products.find((product) => product.id === payload.id && String(product.vendorId) === vendorIdStr)
        : undefined;

      const nextProduct = existing
        ? { ...existing, ...payload, vendorId: vendorIdStr, vendorName }
        : { id: createId('prd'), vendorId: vendorIdStr, vendorName, createdAt: new Date().toISOString(), ...payload };

      const products = payload.id
        ? database.products.map((product) => (product.id === payload.id ? nextProduct : product))
        : [nextProduct, ...database.products];

      return { ...database, products };
    });

    return updated.products.filter((product) => String(product.vendorId) === vendorIdStr);
  }, 650);
}

export async function deleteVendorProduct(vendorId, productId) {
  const vendorIdStr = String(vendorId);
  if (!USE_MOCKS) {
    await apiClient.delete(`/products/${productId}`);
    const response = await apiClient.get('/products');
    return response.data
      .filter((p) => String(p.vendorId) === vendorIdStr)
      .map((p) => ({
        ...p,
        id: String(p.id),
        vendorId: String(p.vendorId),
        status: p.status?.toLowerCase() ?? 'active',
        image: p.imageUrl ?? p.image ?? null,
        isFastDelivery: false,
        createdAt: p.createdAt ?? new Date().toISOString(),
      }));
  }
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
  if (!USE_MOCKS) {
    const response = await apiClient.get(`/orders/vendor/${vendorId}`);
    return response.data;
  }
  return simulateNetwork(
    () =>
      readMockDatabase()
        .orders.filter((order) => order.vendorId === vendorId)
        .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime()),
    320,
  );
}

export async function updateVendorOrderStatus(vendorId, orderId, status) {
  if (!USE_MOCKS) {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    const updatedOrder = response.data;
    const allVendorOrders = await getVendorOrders(vendorId);
    return allVendorOrders;
  }
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
