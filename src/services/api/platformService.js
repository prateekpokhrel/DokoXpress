import { readMockDatabase } from '../mocks/database';
import { simulateNetwork } from '../mocks/fakeApi';

export async function getMarketplaceSnapshot() {
  return simulateNetwork(() => readMockDatabase(), 350);
}
