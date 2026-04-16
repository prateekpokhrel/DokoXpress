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
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">Recent activity</h2>
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
              className="order-card-glow relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0e] p-6 sm:p-8 transition-all duration-300 hover:border-white/20"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                
                {/* LEFT: Order Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h2 className="font-display text-3xl font-black text-white tracking-tighter">
                      {order.vendorName}
                    </h2>
                    <Badge className="px-3 py-1 font-black text-[10px]" variant={getOrderVariant(order.status)}>
                      {order.status}
                    </Badge>
                    {order.fastDeliveryEligible && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1 text-[10px]">
                        ⚡ 15-MIN EXPRESS
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
                    Placed {formatDateTime(order.placedAt)} <span className="mx-2 opacity-50">•</span> ETA {formatDateTime(order.deliveryEta)}
                  </p>
                  
                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      /* FIX: Solid background (#13131a) to kill the white-box glare */
                      <div 
                        key={item.productId} 
                        className="group flex items-center gap-5 rounded-[22px] border border-white/5 bg-[#13131a] p-4 transition-all hover:bg-[#1c1c26]"
                      >
                        <img 
                          alt={item.name} 
                          className="h-16 w-16 rounded-[14px] object-cover border border-white/10 shadow-lg group-hover:scale-105 transition-transform" 
                          src={item.image} 
                        />
                        <div className="flex-1">
                          <p className="font-bold text-white tracking-wide text-lg">{item.name}</p>
                          <p className="text-sm font-semibold text-white/40">
                            Qty {item.quantity} <span className="mx-2 opacity-30">|</span> {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Order Summary Box */}
                {/* FIX: Solid background (#13131a) and better contrast */}
                <div className="rounded-[28px] border border-white/5 bg-[#13131a] p-6 shadow-inner lg:w-72 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Order total</p>
                  <p className="font-display text-4xl font-black text-white drop-shadow-md">
                    {formatCurrency(order.total)}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5 text-[11px] font-bold text-white/30 uppercase tracking-wider">
                    <ClipboardList className="h-4 w-4 text-orange-500" />
                    ID: <span className="font-mono text-white/50">{order.id}</span>
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