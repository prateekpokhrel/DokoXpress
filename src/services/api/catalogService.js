import { apiClient } from './client';

export async function getCatalog() {
    const response = await apiClient.get('/products');
    return response.data
      .filter((p) => !p.status || p.status === 'ACTIVE' || p.status === 'active')
      .map((p) => ({
        ...p,
        id: String(p.id),
        vendorId: p.vendorId ? String(p.vendorId) : null,
        status: p.status?.toLowerCase() ?? 'active',
        image: p.imageUrl ?? p.image ?? null,
        isFastDelivery: p.isFastDelivery ?? false,
        createdAt: p.createdAt ?? new Date().toISOString(),
      }));
}

export async function getCart(userId) {
  const response = await apiClient.get(`/cart/${userId}`);
  return (response.data ?? [])
    .filter((item) => item.product) // Prevent crashes on missing products
    .map((item) => ({
      ...item,
      subtotal: item.quantity * item.product.price,
    }));
}

export async function addToCart(userId, productId) {
  const response = await apiClient.post(`/cart/${userId}`, { productId: productId });
  return (response.data ?? [])
    .filter((item) => item.product)
    .map((item) => ({
      ...item,
      subtotal: item.quantity * item.product.price,
    }));
}

export async function updateCartQuantity(userId, productId, quantity) {
  const response = await apiClient.put(`/cart/${userId}`, { 
    productId: productId, 
    quantity: Number(quantity) 
  });
  return (response.data ?? [])
    .filter((item) => item.product)
    .map((item) => ({
      ...item,
      subtotal: item.quantity * item.product.price,
    }));
}

export async function removeFromCart(userId, productId) {
    const response = await apiClient.delete(`/cart/${userId}/${productId}`);
    return response.data;
}

export async function placeOrders(userId) {
    const response = await apiClient.post(`/orders/checkout/${userId}`);
    return {
      cart: [],
      orders: response.data
    };
}

export async function getUserOrders(userId) {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
}
