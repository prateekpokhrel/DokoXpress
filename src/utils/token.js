import { STORAGE_KEYS } from './constants';

function encodeBase64(value) {
  if (typeof window === 'undefined') {
    return value;
  }

  return window.btoa(value);
}

export function createFakeJwt(payload) {
  const header = encodeBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 8 }));
  return `${header}.${body}.signature`;
}

export function persistSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  const target = session.storage === 'local' ? window.localStorage : window.sessionStorage;
  window.localStorage.removeItem(STORAGE_KEYS.session);
  window.sessionStorage.removeItem(STORAGE_KEYS.session);
  target.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function readStoredSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw =
    window.localStorage.getItem(STORAGE_KEYS.session) ??
    window.sessionStorage.getItem(STORAGE_KEYS.session);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearStoredSession();
    return null;
  }
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.session);
  window.sessionStorage.removeItem(STORAGE_KEYS.session);
}

export function toStorageMode(remember) {
  return remember ? 'local' : 'session';
}
