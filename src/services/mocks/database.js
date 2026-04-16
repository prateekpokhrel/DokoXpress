import { STORAGE_KEYS } from '@/utils/constants';
import { seedDatabase } from './seed';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readMockDatabase() {
  if (!isBrowser()) {
    return clone(seedDatabase);
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.database);

  if (!raw) {
    writeMockDatabase(seedDatabase);
    return clone(seedDatabase);
  }

  try {
    return JSON.parse(raw);
  } catch {
    writeMockDatabase(seedDatabase);
    return clone(seedDatabase);
  }
}

export function writeMockDatabase(database) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.database, JSON.stringify(database));
}

export function resetMockDatabase() {
  writeMockDatabase(seedDatabase);
  return clone(seedDatabase);
}

export function updateMockDatabase(updater) {
  const nextDatabase = updater(clone(readMockDatabase()));
  writeMockDatabase(nextDatabase);
  return clone(nextDatabase);
}

export function findAccountByEmail(database, email) {
  const normalizedEmail = email.trim().toLowerCase();
  return [...database.users, ...database.vendors, ...database.admins].find(
    (account) => account.email.toLowerCase() === normalizedEmail,
  );
}

export function findAccountById(database, id) {
  return [...database.users, ...database.vendors, ...database.admins].find((account) => account.id === id);
}

export function stripPassword(account) {
  const { password: _password, ...safeAccount } = account;
  return safeAccount;
}

export function computePlatformStats(database) {
  return {
    totalUsers: database.users.length,
    totalVendors: database.vendors.length,
    verifiedVendors: database.vendors.filter((vendor) => vendor.verificationStatus === 'verified').length,
    totalProducts: database.products.length,
    totalOrders: database.orders.length,
    grossMerchandiseValue: database.orders.reduce((total, order) => total + order.total, 0),
  };
}
