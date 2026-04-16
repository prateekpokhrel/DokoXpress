import { Store } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatDate } from '@/utils/format';
import { getVerificationVariant } from '@/utils/status';
import './AdminVendorsPage.css';

export function AdminVendorsPage() {
  const { vendors, isHydrating } = useMarketplace();

  return (
    <div className="space-y-5">
      <DashboardTopbar
        subtitle="Review seller records, storefront identity, and verification state from a single moderated view."
        title="Platform vendors"
      />

      <SectionHeader
        description="Vendor rows expand automatically as sellers sign up and join the platform."
        eyebrow="Sellers"
        title="All vendor accounts"
      />

      {isHydrating ? (
        <Skeleton className="h-[320px] rounded-[28px]" />
      ) : vendors.length ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Vendor</th>
                  <th className="px-5 py-4 font-medium">Owner</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-ink">{vendor.storeName}</p>
                        <p className="mt-1 text-xs text-slate-500">{vendor.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{vendor.fullName}</td>
                    <td className="px-5 py-4 text-slate-600">{vendor.storeAddress.city}, {vendor.storeAddress.state}</td>
                    <td className="px-5 py-4">
                      <Badge variant={getVerificationVariant(vendor.verificationStatus)}>{vendor.verificationStatus}</Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(vendor.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState description="Vendor accounts will appear here once sellers complete onboarding." icon={Store} title="No vendors yet" />
      )}
    </div>
  );
}
