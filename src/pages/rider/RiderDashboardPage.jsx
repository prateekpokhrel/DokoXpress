import { useEffect, useState } from 'react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api/client';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { getOrderVariant } from '@/utils/status';
import { CheckCircle, Clock, MapPin, Navigation, Phone, User as UserIcon, Wallet } from 'lucide-react';
import './RiderDashboardPage.css';

export function RiderDashboardPage() {
  const { user } = useAuth();
  const [riderProfile, setRiderProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const profileResp = await apiClient.get(`/riders/profile/${user.id}`);
        setRiderProfile(profileResp.data);

        const ordersResp = await apiClient.get(`/orders/rider/${profileResp.data.id}`);
        setOrders(ordersResp.data);
      } catch (error) {
        console.error('Failed to fetch rider data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  async function updateStatus(orderId, newStatus) {
    try {
      await apiClient.patch(`/orders/${orderId}/tracking`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, trackingStatus: newStatus } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  }

  async function toggleAvailability() {
    if (!riderProfile) return;
    try {
      const resp = await apiClient.patch(`/riders/${riderProfile.id}/availability`);
      setRiderProfile(resp.data);
    } catch (error) {
      alert('Failed to update availability');
    }
  }

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8 rider-fade-in">
      <DashboardTopbar title="Rider Dashboard" />

      {/* STATS & PROFILE  */}

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 overflow-hidden relative rounded-[40px] border p-10 bg-[#13131a] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/5 group">
          {/* Animated Background Gradient */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-600/20 blur-[100px] transition-all duration-500 group-hover:bg-orange-600/30" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-28 w-28 rounded-[32px] bg-gradient-to-br from-orange-500 to-pink-600 p-1">
                <div className="h-full w-full rounded-[30px] bg-[#1a1a24] flex items-center justify-center overflow-hidden">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-orange-500" />
                  )}
                </div>
              </div>
              <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-[#13131a] ${riderProfile?.available ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{user?.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center mt-3">
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold text-[10px] uppercase tracking-widest">
                  {riderProfile?.vehicleNumber || 'No Vehicle Info'}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> {riderProfile?.city || 'Location Pending'}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant={riderProfile?.available ? "success" : "secondary"}
                onClick={toggleAvailability}
                className={`rounded-2xl px-8 py-6 font-black text-sm transition-all duration-300 ${riderProfile?.available
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'bg-white/5 text-white/40 border-white/10'
                  }`}
              >
                {riderProfile?.available ? "Online & Ready" : "Go Online"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[40px] border p-8 bg-[#13131a] border-white/5 flex flex-col justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 relative z-10">Success Rate</p>
          <p className="text-6xl font-black text-white tracking-tighter relative z-10">
            {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'Completed').length / orders.length) * 100) : 0}%
          </p>
          <div className="mt-4 border-t border-white/5 pt-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {orders.filter(o => o.status === 'Completed').length} total orders
            </p>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Tasks', value: orders.filter(o => o.status === 'Placed').length, color: 'text-orange-500' },
          { label: 'Today Earning', value: formatCurrency(orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalPrice * 0.1), 0)), color: 'text-emerald-500' },
          { label: 'Total Distance', value: '42.5 km', color: 'text-blue-500' },
          { label: 'Rating', value: '4.9 ★', color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="rounded-[28px] border border-white/5 bg-[#13131a] p-6 hover:border-white/10 transition-all">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <Navigation className="h-6 w-6 text-orange-500" />
          Current Tasks
        </h3>

        {orders.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-white/10 p-12 text-center bg-white/5">
            <p className="text-white/40 font-bold">No tasks assigned yet. Stay active in {riderProfile?.city}!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map(order => (
              <div key={order.id} className="group relative overflow-hidden rounded-[36px] border border-white/5 bg-[#13131a] p-8 transition-all hover:bg-[#1a1a24] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <div className="absolute right-0 top-0 h-32 w-32 bg-orange-500/5 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className="px-4 py-1.5 font-black text-[10px] uppercase tracking-tighter" variant={getOrderVariant(order.status)}>{order.status}</Badge>
                      <Badge className="px-4 py-1.5 bg-orange-500 text-white border-none font-black text-[10px] uppercase">{order.trackingStatus}</Badge>
                      {order.paymentStatus === 'Paid' && (
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle className="h-3 w-3" /> Paid
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">From (Vendor)</p>
                        <h4 className="text-xl font-bold text-white tracking-tight">{order.vendorName}</h4>
                        <p className="text-white/40 text-sm mt-2 flex items-start gap-2 max-w-xs">
                          <MapPin className="h-4 w-4 shrink-0 text-orange-500 mt-1" />
                          Authorized Pickup Location in {riderProfile?.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">To (Customer)</p>
                        <h4 className="text-xl font-bold text-white tracking-tight">Reciepient ID: {order.userId}</h4>
                        <p className="text-white/40 text-sm mt-2 flex items-start gap-2 max-w-xs">
                          <Navigation className="h-4 w-4 shrink-0 text-emerald-500 mt-1" />
                          Delivery address as per user profile
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-8">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white/40" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase">Placed At</p>
                          <p className="text-xs font-bold text-white/60">{formatDateTime(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/5 flex items-center justify-center">
                          <Wallet className="h-4 w-4 text-emerald-500/40" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase">Potential Earn</p>
                          <p className="text-xs font-bold text-emerald-500/60">{formatCurrency(order.totalPrice * 0.1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-center shrink-0">
                    <div className="rounded-[28px] bg-white/[0.03] border border-white/5 p-6 space-y-4">
                      {order.trackingStatus === 'Order Placed' || order.trackingStatus === 'Rider Assigned' ? (
                        <Button className="h-16 rounded-[20px] bg-white text-black font-black hover:bg-white/90" fullWidth onClick={() => updateStatus(order.id, 'Picked Up')}>Pick up Order</Button>
                      ) : order.trackingStatus === 'Picked Up' ? (
                        <Button className="h-16 rounded-[20px] bg-orange-500 text-white font-black hover:bg-orange-600 shadow-[0_10px_20px_rgba(249,115,22,0.2)]" fullWidth onClick={() => updateStatus(order.id, 'Out for Delivery')}>Go Out for Delivery</Button>
                      ) : order.trackingStatus === 'Out for Delivery' ? (
                        <Button className="h-16 rounded-[20px] bg-emerald-500 text-white font-black hover:bg-emerald-600 shadow-[0_10px_20px_rgba(16,185,129,0.2)]" fullWidth onClick={() => updateStatus(order.id, 'Delivered')}>Complete Mission</Button>
                      ) : (
                        <div className="flex flex-col items-center py-4 bg-emerald-500/10 rounded-[20px] border border-emerald-500/20">
                          <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                          <p className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Job Done</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1 rounded-[16px] bg-white/5 border-white/10 text-white/50 text-xs" variant="secondary">
                          <Phone className="h-3 w-3 mr-2" /> Contact
                        </Button>
                        <Button className="flex-1 rounded-[16px] bg-white/5 border-white/10 text-white/50 text-xs" variant="secondary">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
