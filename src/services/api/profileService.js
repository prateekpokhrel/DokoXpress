import { apiClient } from './client';
import { readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

export async function updateCustomerProfile(userId, updates) {
  try {
    const response = await apiClient.patch(`/users/${userId}`, updates);
    return response.data;
  } catch (err) {
    console.error("Backend update failed, falling back to mock", err);
    // fallback logic...
    const userIdStr = String(userId);
    return simulateNetwork(() => {
      const updated = updateMockDatabase((database) => ({
        ...database,
        users: database.users.map((user) =>
          String(user.id) === userIdStr ? { ...user, ...updates } : user
        ),
      }));
      const user = updated.users.find((entry) => String(entry.id) === userIdStr);
      if (!user) return { id: userId, ...updates };
      return stripPassword(user);
    }, 500);
  }
}

export async function updateVendorProfile(userId, updates) {
  try {
    // Map frontend storeAddress fields to flat backend string fields since User.java has flat country, state, city
    const payload = { ...updates };
    if (payload.storeAddress) {
      payload.country = payload.storeAddress.country;
      payload.state = payload.storeAddress.state;
      payload.city = payload.storeAddress.city;
      delete payload.storeAddress;
    }
    const response = await apiClient.patch(`/users/${userId}`, payload);
    return response.data;
  } catch (err) {
    console.error("Backend update failed, falling back to mock", err);
    // fallback logic...
    const userIdStr = String(userId);
    return simulateNetwork(() => {
      const updated = updateMockDatabase((database) => ({
        ...database,
        vendors: database.vendors.map((vendor) =>
          String(vendor.id) === userIdStr ? { ...vendor, ...updates } : vendor
        ),
      }));

      const vendor = updated.vendors.find((entry) => String(entry.id) === userIdStr);
      if (!vendor) return { id: userId, ...updates };
      return stripPassword(vendor);
    }, 500);
  }
}

export async function getAccountById(userId) {
  const userIdStr = String(userId);
  return simulateNetwork(() => {
    const database = readMockDatabase();
    const account = [...database.users, ...database.vendors, ...database.admins].find(
      (entry) => String(entry.id) === userIdStr
    );

    if (!account) {
      throw new Error('Account not found.');
    }

    return stripPassword(account);
  }, 250);
}
