import { apiClient } from './client';
import { computePlatformStats, readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = false;

export async function getUsers() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/users');
    return response.data
      .filter((u) => u.role === 'user')
      .map(({ password: _p, ...u }) => u);
  }

  return simulateNetwork(() => readMockDatabase().users.map((user) => stripPassword(user)), 280);
}

export async function getVendors() {
  if (!USE_MOCKS) {
    const response = await apiClient.get('/users');
    return response.data
      .filter((u) => u.role === 'vendor')
      .map(({ password: _p, ...u }) => u);
  }

  return simulateNetwork(() => readMockDatabase().vendors.map((vendor) => stripPassword(vendor)), 300);
}

export async function approveVendor(vendorId) {
  if (!USE_MOCKS) {
    const response = await apiClient.patch(`/users/${vendorId}`, { verificationStatus: 'verified' });
    return response.data;
  }
  return simulateNetwork(() => {
    const updated = updateMockDatabase((database) => ({
      ...database,
// ... rest of previous code (keeping it for reference/fallback)
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
