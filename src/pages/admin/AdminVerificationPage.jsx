import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import './AdminVerificationPage.css';

export function AdminVerificationPage() {
  const { vendors, isHydrating, verifyVendor } = useMarketplace();
  const { showToast } = useToast();
  const pendingVendors = vendors.filter((vendor) => vendor.verificationStatus === 'pending');

  return (
    <div className="space-y-5">
      <DashboardTopbar
        subtitle="Approve seller applications and move merchants from pending onboarding into a verified state."
        title="Vendor verification panel"
      />

      <SectionHeader
        description="Approval actions update the platform state immediately and reflect vendor status changes across the workspace."
        eyebrow="Moderation"
        title="Pending approvals"
      />

      {isHydrating ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-[28px]" />
          ))}
        </div>
      ) : pendingVendors.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {pendingVendors.map((vendor) => (
            <Card key={vendor.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Verification request</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{vendor.storeName}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {vendor.fullName} | {vendor.storeAddress.city}, {vendor.storeAddress.state}
                  </p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Citizenship document</p>
                  <p className="mt-2 text-sm font-medium text-ink">{vendor.citizenshipDocument ?? 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Store license</p>
                  <p className="mt-2 text-sm font-medium text-ink">{vendor.storeLicense ?? 'Not provided'}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    void verifyVendor(vendor.id)
                      .then(() =>
                        showToast({
                          title: 'Vendor approved',
                          description: `${vendor.storeName} is now marked as verified.`,
                          variant: 'success',
                        }),
                      )
                      .catch((error) =>
                        showToast({
                          title: 'Approval failed',
                          description: error instanceof Error ? error.message : 'Please try again.',
                          variant: 'error',
                        }),
                      );
                  }}
                  type="button"
                  variant="secondary"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Approve vendor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Once a vendor signs up, any unverified applications will appear here for approval."
          icon={ShieldQuestion}
          title="No pending verification requests"
        />
      )}
    </div>
  );
}
