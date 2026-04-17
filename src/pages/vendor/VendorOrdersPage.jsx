import { Truck, Workflow } from 'lucide-react';
import { ORDER_STATUSES } from '@/utils/constants';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { getOrderVariant } from '@/utils/status';
import './VendorOrdersPage.css';

export function VendorOrdersPage() {
  const { user } = useAuth();
  const { snapshot, isHydrating, updateOrderStatus } = useMarketplace();
  const { showToast } = useToast();

  if (!user || user.role !== 'vendor') {
    return null;
  }

  const orders = (snapshot?.orders ?? [])
    .filter((order) => order.vendorId === user.id)
    .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime());

  return (
    <div className="space-y-5 page-fade-in">
      <DashboardTopbar
        subtitle="Manage customer orders, update status transitions, and keep the storefront delivery expectations aligned."
        title="Vendor order management"
      />

      <SectionHeader
        description="Status updates here immediately propagate across customer order history for a consistent platform experience."
        eyebrow="Fulfilment"
        title="Active vendor orders"
      />

      {isHydrating ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-[28px] order-card-animate" style={{ animationDelay: `${index * 50}ms` }} />
          ))}
        </div>
      ) : orders.length ? (
        <div className="grid gap-4">
          {orders.map((order, index) => (
            <Card
              key={order.id}
              className="order-card-animate border border-white/5 bg-[#0a0a0e]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-semibold text-white">{order.userName}</h2>
                    <Badge variant={getOrderVariant(order.status)}>{order.status}</Badge>
                    {order.fastDeliveryEligible ? <Badge variant="warning">15-min express</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Placed {formatDateTime(order.placedAt)} | ETA {formatDateTime(order.deliveryEta)}
                  </p>
                  <div className="mt-5 grid gap-3">
                    {order.items.map((item) => (
                      /* FIXED: Changed bg-slate-50 to bg-white/5 and added border */
                      <div key={item.productId} className="rounded-2xl bg-white/5 border border-white/5 p-4 shadow-sm transition-transform hover:scale-[1.01]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            {/* FIXED: Changed text-slate-900 to text-white */}
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              Qty {item.quantity} | {formatCurrency(item.price)}
                            </p>
                          </div>
                          {/* FIXED: Changed text-slate-900 to text-white */}
                          <p className="font-semibold text-white">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FIXED: Changed bg-slate-50 to bg-white/5 and added border */}
                <div className="w-full rounded-3xl bg-white/5 border border-white/5 p-4 xl:max-w-xs shadow-sm">
                  <p className="text-sm font-medium text-slate-400">Update status</p>
                  {/* FIXED: Changed bg-white to bg-black/20, text-slate-something to text-white, and updated borders */}
                  <select
                    className="status-select mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all focus:border-coral focus:ring-2 focus:ring-coral/20"
                    onChange={(event) => {
                      void updateOrderStatus(user.id, order.id, event.target.value)
                        .then(() =>
                          showToast({
                            title: 'Order status updated',
                            description: `Moved order ${order.id} to ${event.target.value}.`,
                            variant: 'success',
                          }),
                        )
                        .catch((error) =>
                          showToast({
                            title: 'Status update failed',
                            description: error instanceof Error ? error.message : 'Please try again.',
                            variant: 'error',
                          }),
                        );
                    }}
                    value={order.status}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status} className="bg-slate-900 text-white">
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="mt-5 space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-coral" />
                      Delivery city: {order.deliveryAddress.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-coral" />
                      Order ID: {order.id}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          description="As customers place orders from the storefront, they will appear here grouped by your vendor account."
          icon={Truck}
          title="No incoming orders yet"
        />
      )}
    </div>
  );
}