import { AuthProvider } from './AuthContext';
import { MarketplaceProvider } from './MarketplaceContext';
import { ToastProvider } from './ToastContext';
import './AppProviders.css';

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <MarketplaceProvider>
        <AuthProvider>{children}</AuthProvider>
      </MarketplaceProvider>
    </ToastProvider>
  );
}
