import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { injectSessionUserUpdater, MarketplaceProvider } from './MarketplaceContext';
import { ToastProvider } from './ToastContext';
import './AppProviders.css';

// Inner wrapper that wires AuthContext's updateSessionUser into MarketplaceContext
function SessionBridge({ children }) {
  const { updateSessionUser } = useAuth();
  useEffect(() => {
    injectSessionUserUpdater(updateSessionUser);
  }, [updateSessionUser]);
  return children;
}

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <MarketplaceProvider>
        <AuthProvider>
          <SessionBridge>
            {children}
          </SessionBridge>
        </AuthProvider>
      </MarketplaceProvider>
    </ToastProvider>
  );
}
