import { apiClient } from './client';
import { readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = false;

export async function updateCustomerProfile(userId, updates) {
  if (!USE_MOCKS) {
    const payload = { ...updates };
    if (payload.fullName) {
      payload.name = payload.fullName;
      delete payload.fullName;
    }
    if (payload.address) {
      payload.country = payload.address.country;
      payload.state = payload.address.state;
      payload.city = payload.address.city;
      delete payload.address;
    }
    const response = await apiClient.put(`/users/${userId}`, payload);
    return response.data;
  }
  // ... rest of previous code (keeping it for reference/fallback)
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

export async function updateVendorProfile(userId, updates) {
  if (!USE_MOCKS) {
    const payload = { ...updates };
    if (payload.fullName) {
      payload.name = payload.fullName;
      delete payload.fullName;
    }
    if (payload.storeAddress) {
      payload.country = payload.storeAddress.country;
      payload.state = payload.storeAddress.state;
      payload.city = payload.storeAddress.city;
      delete payload.storeAddress;
    }
    const response = await apiClient.put(`/users/${userId}`, payload);
    return response.data;
  }
  
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

export async function getAccountById(userId) {
  if (!USE_MOCKS) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

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
