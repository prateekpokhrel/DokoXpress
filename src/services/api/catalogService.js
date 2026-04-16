import { apiClient } from './client';
import { readMockDatabase, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

function hydrateCart(database, userId) {
  const items = database.carts[userId] ?? [];
  return items
    .map((item) => {
      const product = database.products.find((entry) => entry.id === item.productId);

      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
        subtotal: product.price * item.quantity,
      };
    })
    .filter(Boolean);
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getCatalog() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/products');
    return response.data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    return database.products.filter((product) => product.status === 'active');
  }, 480);
}

export async function getCart(userId) {
  return simulateNetwork(() => hydrateCart(readMockDatabase(), userId), 240);
}

export async function addToCart(userId, productId) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => {
      const nextCart = [...(database.carts[userId] ?? [])];
      const existing = nextCart.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        nextCart.push({ productId, quantity: 1 });
      }

      return {
        ...database,
        carts: {
          ...database.carts,
          [userId]: nextCart,
        },
      };
    });

    return hydrateCart(updated, userId);
  }, 350);
}

export async function updateCartQuantity(userId, productId, quantity) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => {
      const nextCart = [...(database.carts[userId] ?? [])]
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      return {
        ...database,
        carts: {
          ...database.carts,
          [userId]: nextCart,
        },
      };
    });

    return hydrateCart(updated, userId);
  }, 320);
}

export async function removeFromCart(userId, productId) {
  return updateCartQuantity(userId, productId, 0);
}

export async function placeOrders(userId) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => {
      const cartItems = database.carts[userId] ?? [];
      const customer = database.users.find((user) => user.id === userId);

      if (!customer) {
        throw new Error('Customer profile could not be found.');
      }

      if (!cartItems.length) {
        throw new Error('Your cart is empty.');
      }

      const products = cartItems
        .map((item) => {
          const product = database.products.find((entry) => entry.id === item.productId);
          if (!product) {
            return null;
          }

          return { item, product };
        })
        .filter(Boolean);

      const groupedByVendor = products.reduce(
        (accumulator, entry) => {
          const current = accumulator[entry.product.vendorId] ?? {
            vendorName: entry.product.vendorName,
            items: [],
            fast: true,
          };

          current.items.push({
            productId: entry.product.id,
            name: entry.product.name,
            image: entry.product.image,
            price: entry.product.price,
            quantity: entry.item.quantity,
          });
          current.fast = current.fast && entry.product.isFastDelivery;
          accumulator[entry.product.vendorId] = current;
          return accumulator;
        },
        {},
      );

      const newOrders = Object.entries(groupedByVendor).map(([vendorId, group]) => {
        const total = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const placedAt = new Date().toISOString();
        const eta = new Date(Date.now() + (group.fast ? 15 : 45) * 60 * 1000).toISOString();

        return {
          id: createId('ord'),
          userId,
          userName: customer.fullName,
          vendorId,
          vendorName: group.vendorName,
          items: group.items,
          total,
          status: 'Placed',
          deliveryEta: eta,
          fastDeliveryEligible: group.fast,
          deliveryAddress: customer.address,
          placedAt,
        };
      });

      return {
        ...database,
        orders: [...newOrders, ...database.orders],
        carts: {
          ...database.carts,
          [userId]: [],
        },
      };
    });

    return {
      cart: hydrateCart(updated, userId),
      orders: updated.orders.filter((order) => order.userId === userId),
    };
  }, 800);
}

export async function getUserOrders(userId) {
  return simulateNetwork(
    () =>
      readMockDatabase()
        .orders.filter((order) => order.userId === userId)
        .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime()),
    300,
  );
}
