import { createFakeJwt, persistSession, toStorageMode } from '@/utils/token';
import { apiClient } from './client';
import { findAccountByEmail, readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = true;

function buildAuthResponse(account, remember) {
  const session = {
    token: createFakeJwt({ sub: account.id, role: account.role, email: account.email }),
    userId: account.id,
    role: account.role,
    storage: toStorageMode(remember),
  };

  persistSession(session);

  return {
    session,
    user: stripPassword(account),
  };
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function assertUniqueEmail(email) {
  const existing = findAccountByEmail(readMockDatabase(), email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
}

export async function login(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    const normalizedEmail = payload.email.trim().toLowerCase();

    const scope =
      payload.role === 'user'
        ? database.users
        : payload.role === 'vendor'
          ? database.vendors
          : database.admins;

    const account = scope.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === payload.password,
    );

    if (!account) {
      throw new Error('Invalid credentials for the selected role.');
    }

    return buildAuthResponse(account, payload.remember);
  }, 650);
}

export async function signInWithGoogle(role, remember) {
  return simulateNetwork(() => {
    const database = readMockDatabase();

    const account =
      role === 'user'
        ? database.users[0]
        : role === 'vendor'
          ? database.vendors[0]
          : database.admins[0];

    return buildAuthResponse(account, remember);
  }, 500);
}

export async function signupCustomer(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/signup/customer', payload);
    return response.data;
  }

  return simulateNetwork(() => {
    assertUniqueEmail(payload.email);

    const nextUser = {
      id: createId('usr'),
      role: 'user',
      fullName: payload.fullName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      password: payload.password,
      address: payload.address,
      profilePhoto: payload.profilePhoto,
      createdAt: new Date().toISOString(),
    };

    updateMockDatabase((database) => ({
      ...database,
      users: [nextUser, ...database.users],
      carts: {
        ...database.carts,
        [nextUser.id]: [],
      },
    }));

    return buildAuthResponse(nextUser, payload.remember);
  }, 700);
}

export async function signupVendor(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/signup/vendor', payload);
    return response.data;
  }

  return simulateNetwork(() => {
    assertUniqueEmail(payload.email);

    const nextVendor = {
      id: createId('ven'),
      role: 'vendor',
      fullName: payload.fullName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      password: payload.password,
      storeName: payload.storeName,
      storeAddress: payload.storeAddress,
      citizenshipDocument: payload.citizenshipDocument,
      storeLicense: payload.storeLicense,
      verificationStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    updateMockDatabase((database) => ({
      ...database,
      vendors: [nextVendor, ...database.vendors],
    }));

    return buildAuthResponse(nextVendor, payload.remember);
  }, 700);
}

export async function signupAdmin(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/signup/admin', payload);
    return response.data;
  }

  return simulateNetwork(() => {
    assertUniqueEmail(payload.email);

    const nextAdmin = {
      id: createId('adm'),
      role: 'admin',
      fullName: payload.fullName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      password: payload.password,
      department: payload.department,
      createdAt: new Date().toISOString(),
    };

    updateMockDatabase((database) => ({
      ...database,
      admins: [nextAdmin, ...database.admins],
    }));

    return buildAuthResponse(nextAdmin, payload.remember);
  }, 700);
}
