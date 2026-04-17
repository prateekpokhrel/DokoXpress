import { readMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';
import { apiClient } from './client';

export async function getMarketplaceSnapshot() {
  try {
    // Fetch users, products AND orders from the real backend in parallel
    const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
      apiClient.get('/users'),
      apiClient.get('/products'),
      apiClient.get('/orders'),
    ]);
 
    const realUsers = usersResponse.data;
    const realProducts = productsResponse.data;
    const realOrders = ordersResponse.data;

    // Load the mock DB as the base (for carts, orders, etc.)
    const snapshot = await simulateNetwork(() => readMockDatabase(), 200);

    // ── Users ──────────────────────────────────────────────────────────────
    const mappedRealUsers = realUsers.map((u) => {
      const isVendor = u.role?.toLowerCase() === 'vendor';
      return {
        ...u,
        id: String(u.id),
        fullName: u.name || u.email,
        address: { city: u.city ?? 'N/A', state: u.state ?? 'N/A' },
        // Admin Vendor Page expects storeAddress and storeName
        storeAddress: isVendor ? { city: u.city ?? 'N/A', state: u.state ?? 'N/A' } : undefined,
        storeName: isVendor ? (u.storeName || 'Unnamed Store') : undefined,
        verificationStatus: u.verificationStatus || (isVendor ? 'pending' : 'verified'),
        citizenshipDocument: u.citizenshipDocument,
        storeLicense: u.storeLicense,
        createdAt: u.createdAt ?? new Date().toISOString(),
      };
    });

    const regularUsers = mappedRealUsers.filter((u) => u.role?.toLowerCase() === 'user' || !u.role);
    const vendors      = mappedRealUsers.filter((u) => u.role?.toLowerCase() === 'vendor');

    snapshot.users = regularUsers;

    const realVendorIds = new Set(vendors.map((v) => v.id));
    snapshot.vendors = [
      ...vendors,
      ...snapshot.vendors.filter((mock) => !realVendorIds.has(mock.id)),
    ];

    // ── Products ───────────────────────────────────────────────────────────
    // Normalise backend product shape; backend products replace ALL mock products
    const mappedRealProducts = realProducts
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

    // Merge: backend products take precedence; keep mock products that have no backend counterpart
    const backendProductIds = new Set(mappedRealProducts.map((p) => p.id));
    snapshot.products = [
      ...mappedRealProducts,
      ...snapshot.products.filter((m) => !backendProductIds.has(m.id)),
    ];

    // ── Orders ────────────────────────────────────────────────────────────
    const mappedRealOrders = realOrders.map((o) => ({
      ...o,
      id: String(o.id),
      userId: String(o.userId),
      vendorId: String(o.vendorId),
      total: o.totalPrice, // Real backend uses totalPrice
      placedAt: o.createdAt ?? new Date().toISOString(),
      items: (o.items || []).map((item) => ({
        ...item,
        id: String(item.id),
        productId: String(item.productId),
        name: item.product?.name || 'Unknown Item',
        image: item.product?.imageUrl || item.product?.image || null,
        price: item.price,
      })),
    }));

    // Merge: backend orders take precedence
    const backendOrderIds = new Set(mappedRealOrders.map((o) => o.id));
    snapshot.orders = [
      ...mappedRealOrders,
      ...snapshot.orders.filter((m) => !backendOrderIds.has(m.id)),
    ];

    return snapshot;
  } catch (error) {
    console.log('Fallback to purely mocked snapshot', error);
    return simulateNetwork(() => readMockDatabase(), 350);
  }
}
