import { apiClient } from './client';
import { readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

export async function updateCustomerProfile(userId, updates) {
  if (!USE_MOCKS) {
    const response = await apiClient.patch(`/users/${userId}`, updates);
    return response.data;
  }

  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      users: database.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    }));

    const user = updated.users.find((entry) => entry.id === userId);

    if (!user) {
      throw new Error('Customer profile not found.');
    }

    return stripPassword(user);
  }, 500);
}

export async function updateVendorProfile(userId, updates) {
  if (!USE_MOCKS) {
    const response = await apiClient.patch(`/vendors/${userId}`, updates);
    return response.data;
  }

  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      vendors: database.vendors.map((vendor) => (vendor.id === userId ? { ...vendor, ...updates } : vendor)),
    }));

    const vendor = updated.vendors.find((entry) => entry.id === userId);

    if (!vendor) {
      throw new Error('Vendor profile not found.');
    }

    return stripPassword(vendor);
  }, 500);
}

export async function getAccountById(userId) {
  return simulateNetwork(() => {
    const database = readMockDatabase();
    const account = [...database.users, ...database.vendors, ...database.admins].find((entry) => entry.id === userId);

    if (!account) {
      throw new Error('Account not found.');
    }

    return stripPassword(account);
  }, 250);
}
