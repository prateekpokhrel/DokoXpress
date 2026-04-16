import { BarChart3, Boxes, ShoppingBag, ShieldCheck, Store, Users } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatCurrency, formatDateTime } from '@/utils/format';
import './AdminOverviewPage.css';

export function AdminOverviewPage() {
  const { snapshot, isHydrating } = useMarketplace();

  const stats = {
    totalUsers: snapshot?.users.length ?? 0,
    totalVendors: snapshot?.vendors.length ?? 0,
    verifiedVendors: snapshot?.vendors.filter((vendor) => vendor.verificationStatus === 'verified').length ?? 0,
    totalProducts: snapshot?.products.length ?? 0,
    totalOrders: snapshot?.orders.length ?? 0,
    gmv: snapshot?.orders.reduce((sum, order) => sum + order.total, 0) ?? 0,
  };

  const recentOrders = [...(snapshot?.orders ?? [])]
    .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime())
    .slice(0, 4);
  const pendingVendors = (snapshot?.vendors ?? []).filter((vendor) => vendor.verificationStatus === 'pending');

  return (
    <div className="space-y-5">
      <DashboardTopbar
        subtitle="Track platform health, vendor onboarding, and commercial activity from a single operator view."
        title="Admin overview"
      />

      <SectionHeader
        description="These cards summarize current marketplace activity and are ready to connect to backend analytics endpoints as the platform grows."
        eyebrow="Platform metrics"
        title="Operational snapshot"
      />

      {isHydrating ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-[28px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard hint="Customer accounts with profile and address details." icon={Users} label="Users" value={String(stats.totalUsers)} />
          <StatsCard hint="Total sellers onboarded to the platform." icon={Store} label="Vendors" value={String(stats.totalVendors)} />
          <StatsCard hint="Approved merchants ready for production trust flows." icon={ShieldCheck} label="Verified vendors" value={String(stats.verifiedVendors)} />
          <StatsCard hint="Marketplace GMV across processed orders." icon={BarChart3} label="GMV" value={formatCurrency(stats.gmv)} />
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionHeader
            description="Recently placed orders across the marketplace."
            eyebrow="Commerce"
            title="Latest orders"
          />
          <div className="mt-6 space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{order.userName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.vendorName} | {formatDateTime(order.placedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">{formatCurrency(order.total)}</p>
                    <Badge variant="info">{order.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            description="Sellers that still require moderation attention."
            eyebrow="Verification"
            title="Pending vendors"
          />
          <div className="mt-6 space-y-3">
            {pendingVendors.length ? (
              pendingVendors.map((vendor) => (
                <div key={vendor.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{vendor.storeName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                        {vendor.fullName} | {vendor.storeAddress.city}
                    </p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800">All vendors are verified.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <ShoppingBag className="h-6 w-6 text-coral" />
          <p className="mt-4 text-sm font-medium text-slate-500">Orders</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{stats.totalOrders}</p>
        </Card>
        <Card>
          <Boxes className="h-6 w-6 text-spruce" />
          <p className="mt-4 text-sm font-medium text-slate-500">Products</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{stats.totalProducts}</p>
        </Card>
        <Card>
          <Store className="h-6 w-6 text-coral" />
          <p className="mt-4 text-sm font-medium text-slate-500">Verification queue</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{pendingVendors.length}</p>
        </Card>
      </div>
    </div>
  );
}
