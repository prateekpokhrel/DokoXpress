import { createContext, useContext, useEffect, useState } from 'react';
import { approveVendor } from '@/services/api/adminService';
import { addToCart, getCart, placeOrders, removeFromCart, updateCartQuantity } from '@/services/api/catalogService';
import { getMarketplaceSnapshot } from '@/services/api/platformService';
import { updateCustomerProfile, updateVendorProfile } from '@/services/api/profileService';
import './MarketplaceContext.css';

import {
  deleteVendorProduct,
  setVendorOrderStatus,
  upsertVendorProduct,
} from '@/store/serviceAdapters';

const MarketplaceContext = createContext(null);

// Will be injected from AuthContext via MarketplaceProvider props
let _updateSessionUser = null;
export function injectSessionUserUpdater(fn) {
  _updateSessionUser = fn;
}

export function MarketplaceProvider({ children }) {
  const [snapshot, setSnapshot] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);

  async function refreshSnapshot() {
    setIsHydrating(true);
    try {
      const nextSnapshot = await getMarketplaceSnapshot();
      setSnapshot(nextSnapshot);
    } finally {
      setIsHydrating(false);
    }
  }

  useEffect(() => {
    void refreshSnapshot();
  }, []);

  async function syncAfter(promise) {
    const result = await promise;
    await refreshSnapshot();
    return result;
  }

  return (
    <MarketplaceContext.Provider
      value={{
        snapshot,
        isHydrating,
        refreshSnapshot,
        users: (snapshot?.users ?? []).map(({ password: _p, ...u }) => u),
        vendors: (snapshot?.vendors ?? []).map(({ password: _p, ...v }) => v),
        admins: (snapshot?.admins ?? []).map(({ password: _p, ...a }) => a),
        products: snapshot?.products ?? [],
        getUserCart: getCart,
        addItemToCart: addToCart,
        changeCartQuantity: updateCartQuantity,
        deleteCartItem: removeFromCart,
        checkout: async (userId) => {
          await syncAfter(placeOrders(userId));
        },
        saveVendorProduct: async (vendorId, payload) => {
          await syncAfter(upsertVendorProduct(vendorId, payload));
        },
        removeVendorProduct: async (vendorId, productId) => {
          await syncAfter(deleteVendorProduct(vendorId, productId));
        },
        updateOrderStatus: async (vendorId, orderId, status) => {
          await syncAfter(setVendorOrderStatus(vendorId, orderId, status));
        },
        verifyVendor: async (vendorId) => {
          await syncAfter(approveVendor(vendorId));
        },
        saveCustomerProfile: async (userId, updates) => {
          const result = await syncAfter(updateCustomerProfile(userId, updates));
          // Persist updated user into the session so it survives page refresh
          if (_updateSessionUser && result) _updateSessionUser(result);
          return result;
        },
        saveVendorProfile: async (vendorId, updates) => {
          const result = await syncAfter(updateVendorProfile(vendorId, updates));
          if (_updateSessionUser && result) _updateSessionUser(result);
          return result;
        },
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider.');
  return context;
}
