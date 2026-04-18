import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api/client';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { FormField } from '@/components/common/FormField';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { FileUser, ShieldCheck, Truck, UserCircle } from 'lucide-react';
import './RiderProfilePage.css';

export function RiderProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [riderProfile, setRiderProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const resp = await apiClient.get(`/riders/profile/${user.id}`);
        setRiderProfile(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div className="space-y-8 rider-profile-fade-in pb-20">
      <DashboardTopbar title="Profile Settings" />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Public Identity */}
        <div className="lg:col-span-1 space-y-6">
           <div className="rounded-[40px] border border-white/5 bg-[#13131a] p-10 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
               <div className="relative inline-block mb-6">
                 <div className="h-32 w-32 rounded-[40px] bg-gradient-to-br from-orange-500 to-pink-600 p-1">
                   <div className="h-full w-full rounded-[38px] bg-[#1a1a24] flex items-center justify-center overflow-hidden">
                      {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle className="h-16 w-16 text-orange-500" />
                      )}
                   </div>
                 </div>
               </div>
               <h3 className="text-2xl font-black text-white mb-2">{user?.name}</h3>
               <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">{user?.email}</p>
               
               <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold">
                    <span className="text-white/30">Member Since</span>
                    <span className="text-white">April 2026</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold">
                    <span className="text-white/30">Total Earnings</span>
                    <span className="text-emerald-500">Rs. 12,450.00</span>
                  </div>
               </div>
           </div>

           <div className="rounded-[32px] border border-white/5 bg-emerald-500/5 p-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Verified Partner</p>
                <p className="text-white/60 text-xs font-medium">Documents approved by DokoXpress Admin.</p>
              </div>
           </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
           <section className="rounded-[40px] border border-white/5 bg-[#13131a] p-10 shadow-sm">
             <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Truck className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Delivery Vehicle Information</h4>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <FormField disabled label="Vehicle Number" value={riderProfile?.vehicleNumber} />
                <FormField disabled label="Registered City" value={riderProfile?.city} />
                <FormField disabled label="Operation District" value={riderProfile?.district} />
                <FormField disabled label="Vehicle Type" value="Two Wheeler / Bike" />
             </div>
           </section>

           <section className="rounded-[40px] border border-white/5 bg-[#13131a] p-10 shadow-sm">
             <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FileUser className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Personal & Legal</h4>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <FormField disabled label="Age" value={riderProfile?.age?.toString()} />
                <FormField disabled label="Country" value={riderProfile?.country} />
                <FormField disabled label="Primary Contact" value={riderProfile?.contact} />
                <FormField disabled label="Home Base" value={riderProfile?.city} />
             </div>
           </section>

           <div className="flex justify-end gap-4">
              <Button className="rounded-2xl px-8 py-6 text-white/40" variant="secondary">Request Info Update</Button>
              <Button className="rounded-2xl px-12 py-6 bg-orange-500 text-white font-black shadow-[0_10px_30px_rgba(249,115,22,0.3)]">Save Changes</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
