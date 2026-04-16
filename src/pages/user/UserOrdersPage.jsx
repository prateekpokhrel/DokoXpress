import { ClipboardList, PackageSearch } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { getOrderVariant } from '@/utils/status';
import './UserOrdersPage.css';

export function UserOrdersPage() {
  const { user } = useAuth();
  const { snapshot, isHydrating } = useMarketplace();

  if (!user || user.role !== 'user') {
    return null;
  }

  const orders = (snapshot?.orders ?? [])
    .filter((order) => order.userId === user.id)
    .sort((left, right) => new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime());

  return (
    <div className="space-y-8 orders-fade-in">
      <DashboardTopbar
        title="Order history"
      />

      {/* ================= SECTION HEADER ================= */}
      <div className="mb-6 mt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
          Purchases
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Recent activity</h2>
      </div>

      {isHydrating ? (
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            /* FIX: Darkened Skeleton to prevent the 'glare' while loading */
            <Skeleton key={index} className="h-64 rounded-[32px] bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : orders.length ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="relative overflow-hidden rounded-[32px] border p-6 sm:p-8 transition-all duration-300"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                
                {/* LEFT: Order Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h2 className="font-display text-3xl font-black tracking-tighter" style={{ color: 'var(--text-main)' }}>
                      {order.vendorName}
                    </h2>
                    <Badge className="px-3 py-1 font-black text-[10px]" variant={getOrderVariant(order.status)}>
                      {order.status}
                    </Badge>
                    {order.fastDeliveryEligible && (
                      <Badge className="bg-orange-50 text-orange-600 border px-3 py-1 text-[10px]">
                        ⚡ 15-MIN EXPRESS
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
                    Placed {formatDateTime(order.placedAt)} <span className="mx-2 opacity-50">•</span> ETA {formatDateTime(order.deliveryEta)}
                  </p>
                  
                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      /* FIX: Solid background (#13131a) to kill the white-box glare */
                      <div 
                        key={item.productId} 
                        className="group flex items-center gap-5 rounded-[22px] border p-4 transition-all"
                        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                      >
                        <img 
                          alt={item.name} 
                          className="h-16 w-16 rounded-[14px] object-cover border shadow-sm group-hover:scale-105 transition-transform" 
                          style={{ borderColor: 'var(--border)' }}
                          src={item.image} 
                        />
                        <div className="flex-1">
                          <p className="font-bold tracking-wide text-lg" style={{ color: 'var(--text-main)' }}>{item.name}</p>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                            Qty {item.quantity} <span className="mx-2 opacity-30">|</span> {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Order Summary Box */}
                {/* RIGHT: Order Summary Box */}
                <div
                  className="rounded-[28px] border p-6 shadow-sm lg:w-72 flex flex-col justify-center"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>Order total</p>
                  <p className="font-display text-4xl font-black" style={{ color: 'var(--text-main)' }}>
                    {formatCurrency(order.total)}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-3 border-t pt-5 text-[11px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <ClipboardList className="h-4 w-4 text-orange-500" />
                    ID: <span className="font-mono">{order.id}</span>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Place an order from the product dashboard to populate this section."
          icon={PackageSearch}
          title="No orders yet"
        />
      )}
    </div>
  );
}