import { apiClient } from './client';
import { computePlatformStats, readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

export async function getUsers() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/admin/users');
    return response.data;
  }

  return simulateNetwork(() => readMockDatabase().users.map((user) => stripPassword(user)), 280);
}

export async function getVendors() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/admin/vendors');
    return response.data;
  }

  return simulateNetwork(() => readMockDatabase().vendors.map((vendor) => stripPassword(vendor)), 300);
}

export async function approveVendor(vendorId) {
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
      vendors: database.vendors.map((vendor) =>
        vendor.id === vendorId ? { ...vendor, verificationStatus: 'verified' } : vendor,
      ),
    }));

    return updated.vendors.map((vendor) => stripPassword(vendor));
  }, 450);
}

export async function getPlatformStats() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  }

  return simulateNetwork(() => computePlatformStats(readMockDatabase()), 240);
}
