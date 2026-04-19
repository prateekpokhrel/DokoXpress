import { createFakeJwt, persistSession, toStorageMode } from '@/utils/token';
import { normalizeUser } from '@/utils/user';
import { apiClient } from './client';
import { findAccountByEmail, readMockDatabase, stripPassword, updateMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

const USE_MOCKS = false;

function buildAuthResponse(account, remember) {
  const normalized = normalizeUser(account);
  const session = {
    token: createFakeJwt({ sub: normalized.id, role: normalized.role, email: normalized.email }),
    userId: normalized.id,
    role: normalized.role,
    storage: toStorageMode(remember),
    user: normalized,
  };

  persistSession(session);

  return {
    session,
    user: normalized,
  };
}

export async function login(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/login', payload);
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(payload.remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    const account = findAccountByEmail(database, payload.email);

    if (!account || account.password !== payload.password || account.role !== payload.role) {
      throw new Error('Invalid email, password, or access role.');
    }

    return buildAuthResponse(account, payload.remember);
  }, 500);
}

export async function signInWithGoogle(role, remember) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/google', { role, remember });
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

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
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(payload.remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    if (findAccountByEmail(database, payload.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newCustomer = { id: `usr_${Date.now()}`, role: 'user', createdAt: new Date().toISOString(), ...payload };
    updateMockDatabase((draft) => {
      draft.users.push(newCustomer);
      draft.carts[newCustomer.id] = [];
      return draft;
    });
    return buildAuthResponse(newCustomer, payload.remember);
  }, 800);
}

export async function signupVendor(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/signup/vendor', payload);
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(payload.remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    if (findAccountByEmail(database, payload.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newVendor = { id: `ven_${Date.now()}`, role: 'vendor', verificationStatus: 'pending', createdAt: new Date().toISOString(), ...payload };
    updateMockDatabase((draft) => {
      draft.vendors.push(newVendor);
      return draft;
    });
    return buildAuthResponse(newVendor, payload.remember);
  }, 1000);
}

export async function signupAdmin(payload) {
  if (!USE_MOCKS) {
    const response = await apiClient.post('/auth/signup/admin', payload);
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(payload.remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    if (findAccountByEmail(database, payload.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newAdmin = { id: `adm_${Date.now()}`, role: 'admin', createdAt: new Date().toISOString(), ...payload };
    updateMockDatabase((draft) => {
      draft.admins.push(newAdmin);
      return draft;
    });
    return buildAuthResponse(newAdmin, payload.remember);
  }, 600);
}
export async function signupRider(payload) {
  if (!USE_MOCKS) {
    const userPayload = {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      country: payload.country,
      state: payload.district,
      city: payload.city,
      role: 'rider',
      remember: payload.remember
    };

    const response = await apiClient.post('/auth/signup/rider', payload);
    const data = response.data;
    if (data && data.session) {
      const normalized = normalizeUser(data.user);
      data.session.storage = toStorageMode(payload.remember);
      data.session.user = normalized;
      data.user = normalized;
      persistSession(data.session);
    }
    return data;
  }

  return simulateNetwork(() => {
    const database = readMockDatabase();
    if (findAccountByEmail(database, payload.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newRider = { id: `rid_${Date.now()}`, role: 'rider', ...payload };
    updateMockDatabase((draft) => {
      draft.riders = draft.riders || [];
      draft.riders.push(newRider);
      return draft;
    });
    return buildAuthResponse(newRider, payload.remember);
  }, 1000);
}
