import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api/client';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { getOrderVariant } from '@/utils/status';
import { Calendar, Package, TrendingUp } from 'lucide-react';
import './RiderOrdersPage.css';

export function RiderOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [riderProfile, setRiderProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileResp = await apiClient.get(`/riders/profile/${user.id}`);
        setRiderProfile(profileResp.data);
        const ordersResp = await apiClient.get(`/orders/rider/${profileResp.data.id}`);
        setOrders(ordersResp.data.filter(o => o.status === 'Completed'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return <div>Loading records...</div>;

  const totalEarned = orders.reduce((sum, o) => sum + (o.totalPrice * 0.1), 0);

  return (
    <div className="space-y-8 rider-orders-fade-in pb-20">
      <DashboardTopbar title="Delivery History" />

      {/* Summary Header */}
      <div className="rounded-[40px] border border-white/5 bg-[#13131a] p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-[30px] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <TrendingUp className="h-10 w-10" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Total Career Earnings</p>
               <h2 className="text-4xl font-black text-white">{formatCurrency(totalEarned)}</h2>
            </div>
         </div>
         
         <div className="flex gap-4">
            <div className="text-center px-8 py-4 rounded-3xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-white/20 uppercase mb-1">Total Drops</p>
                <p className="text-2xl font-black text-white">{orders.length}</p>
            </div>
            <div className="text-center px-8 py-4 rounded-3xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-white/20 uppercase mb-1">Retention</p>
                <p className="text-2xl font-black text-white">98%</p>
            </div>
         </div>
      </div>

      <div className="space-y-4">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           <Calendar className="h-5 w-5 text-orange-500" />
           Past Deliveries
         </h3>
         
         {orders.length === 0 ? (
           <div className="py-20 text-center rounded-[40px] border border-dashed border-white/10 opacity-40">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold">No completed deliveries found.</p>
           </div>
         ) : (
           <div className="grid gap-4">
             {orders.map(order => (
               <div key={order.id} className="rounded-[30px] border border-white/5 bg-[#13131a] p-6 flex flex-col md:flex-row justify-between items-center transition-all hover:bg-white/5">
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                        <Package className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white">Order #{order.id}</h4>
                        <p className="text-xs text-white/40">Delivered on {formatDateTime(order.createdAt)}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-10 mt-4 md:mt-0">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-white/20 uppercase">Earnings</p>
                        <p className="text-sm font-black text-emerald-500">{formatCurrency(order.totalPrice * 0.1)}</p>
                     </div>
                     <Badge variant="success">Success</Badge>
                  </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
