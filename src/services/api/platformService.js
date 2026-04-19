import { normalizeUser } from '@/utils/user';
import { apiClient } from './client';

export async function getMarketplaceSnapshot() {
  try {
    const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
      apiClient.get('/users'),
      apiClient.get('/products'),
      apiClient.get('/orders'),
    ]);

    const realUsers = usersResponse.data;
    const realProducts = productsResponse.data;
    const realOrders = ordersResponse.data;

    const snapshot = {
      users: [],
      vendors: [],
      admins: [],
      products: [],
      orders: [],
      carts: {},
    };

    // Users
    const mappedRealUsers = realUsers.map((u) => normalizeUser(u));
    snapshot.users = mappedRealUsers.filter((u) => u.role?.toLowerCase() === 'user' || !u.role);
    snapshot.vendors = mappedRealUsers.filter((u) => u.role?.toLowerCase() === 'vendor');
    snapshot.admins = mappedRealUsers.filter((u) => u.role?.toLowerCase() === 'admin');

    // Products
    snapshot.products = realProducts
      .filter((p) => !p.status || p.status === 'ACTIVE' || p.status === 'active')
      .map((p) => {
        const vendor = mappedRealUsers.find((u) => String(u.id) === String(p.vendorId));
        return {
          ...p,
          id: String(p.id),
          vendorId: p.vendorId ? String(p.vendorId) : null,
          vendorName: vendor?.storeName || vendor?.fullName || 'Unknown Vendor',
          locationTag: vendor?.address?.city || 'Global',
          deliveryMinutes: 15,
          status: p.status?.toLowerCase() ?? 'active',
          image: p.imageUrl ?? p.image ?? null,
          isFastDelivery: p.isFastDelivery ?? false,
          createdAt: p.createdAt ?? new Date().toISOString(),
        };
      });

    // Orders
    snapshot.orders = realOrders.map((o) => {
      const customer = mappedRealUsers.find((u) => String(u.id) === String(o.userId));
      return {
        ...o,
        id: String(o.id),
        userId: String(o.userId),
        vendorId: String(o.vendorId),
        total: o.totalPrice,
        placedAt: o.createdAt ?? new Date().toISOString(),
        deliveryAddress: {
          city: customer?.address?.city || 'Not provided',
          state: customer?.address?.state || '',
        },
        items: (o.items || []).map((item) => ({
          ...item,
          id: String(item.id),
          productId: String(item.productId),
          name: item.product?.name || 'Unknown Item',
          image: item.product?.imageUrl || item.product?.image || null,
          price: item.price,
        })),
      };
    });

    return snapshot;
  } catch (error) {
    console.error('Platform refresh failed:', error);

    return { users: [], vendors: [], admins: [], products: [], orders: [] };
  }
}
