import { createContext, useContext, useEffect, useState } from 'react';
import { login, signInWithGoogle, signupCustomer, signupRider, signupVendor } from '@/services/api/authService';
import { findAccountById, readMockDatabase, stripPassword } from '@/services/mocks/database';
import { clearStoredSession, persistSession, readStoredSession } from '@/utils/token';
import { useMarketplace } from './MarketplaceContext';
import './AuthContext.css';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { snapshot, refreshSnapshot } = useMarketplace();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthBusy, setIsAuthBusy] = useState(false);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (!storedSession) {
      setSession(null);
      setUser(null);
      setIsInitializing(false);
      return;
    }

    // If the session already contains a cached user object (from backend login), use it directly
    if (storedSession.user) {
      setSession(storedSession);
      setUser(storedSession.user);
      setIsInitializing(false);
      return;
    }

    // Fallback: try to find in mock database
    const database = snapshot ?? readMockDatabase();
    const account = findAccountById(database, storedSession.userId);

    if (!account) {
      clearStoredSession();
      setSession(null);
      setUser(null);
      setIsInitializing(false);
      return;
    }

    setSession(storedSession);
    setUser(stripPassword(account));
    setIsInitializing(false);
  }, [snapshot]);

  async function handleAuth(promise) {
    setIsAuthBusy(true);
    try {
      const response = await promise;
      setSession(response.session);
      setUser(response.user);
      await refreshSnapshot();
    } finally {
      setIsAuthBusy(false);
    }
  }

  // Called after profile updates to keep session.user in sync with latest data
  function updateSessionUser(updatedUser) {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    const storedSession = readStoredSession();
    if (storedSession) {
      storedSession.user = { ...(storedSession.user ?? {}), ...updatedUser };
      persistSession(storedSession);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role: session?.role ?? null,
        isInitializing,
        isAuthBusy,
        updateSessionUser,
        loginWithPassword: async (payload) => {
          await handleAuth(login(payload));
        },
        signupAsCustomer: async (payload) => {
          await handleAuth(signupCustomer(payload));
        },
        signupAsVendor: async (payload) => {
          await handleAuth(signupVendor(payload));
        },
        signupAsRider: async (payload) => {
          await handleAuth(signupRider(payload));
        },
        loginWithGoogle: async (role, remember) => {
          await handleAuth(signInWithGoogle(role, remember));
        },
        logout: () => {
          clearStoredSession();
          setSession(null);
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
