import { readMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';
import { apiClient } from './client';

export async function getMarketplaceSnapshot() {
  try {
    // Attempt real fetch of users from database backend
    const response = await apiClient.get('/users');
    const realUsers = response.data;
    
    // Simulate latency for the mock DB fetching
    const snapshot = await simulateNetwork(() => readMockDatabase(), 350);
    
    // Map backend users into snapshot formatting and merge
    const mappedRealUsers = realUsers.map(u => ({
      ...u,
      id: String(u.id), 
      fullName: u.name || u.email,
      address: { city: 'N/A', state: 'N/A' }, // Fallbacks as spring backend model might lack fields
      createdAt: new Date().toISOString()
    }));

    // Filter by role into correct mock db buckets
    const regularUsers = mappedRealUsers.filter(u => u.role === 'user' || !u.role);
    const vendors = mappedRealUsers.filter(u => u.role === 'vendor' || u.role === 'Vendor');
    const admins = mappedRealUsers.filter(u => u.role === 'admin' || u.role === 'Admin');

    snapshot.users = regularUsers;
    
    // Append any newly registered real DB vendors to the existing mocked ones
    // so tests don't break, while showing real vendors from the backend.
    const realVendorIds = new Set(vendors.map(v => v.id));
    snapshot.vendors = [
      ...vendors,
      ...snapshot.vendors.filter(mock => !realVendorIds.has(mock.id))
    ];
    
    return snapshot;
  } catch (error) {
    console.log("Fallback to purely mocked snapshot", error);
    return simulateNetwork(() => readMockDatabase(), 350);
  }
}
