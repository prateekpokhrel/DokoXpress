
export function normalizeUser(rawUser) {
  if (!rawUser) return null;
  const isVendor = rawUser.role?.toLowerCase() === 'vendor';

  const address = {
    city: rawUser.city || '',
    state: rawUser.state || '',
    country: rawUser.country || '',
  };

  return {
    ...rawUser,
    id: String(rawUser.id),
    fullName: rawUser.name || rawUser.email || 'User',
    address: address,
    storeAddress: isVendor ? { ...address } : undefined,
    storeName: rawUser.storeName || (isVendor ? 'Unnamed Store' : undefined),
    verificationStatus: rawUser.verificationStatus || (isVendor ? 'pending' : 'verified'),
  };
}
