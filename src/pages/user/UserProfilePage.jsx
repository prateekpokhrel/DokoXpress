import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, UserCircle2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import './UserProfilePage.css';

const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  country: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  profilePhoto: z.string().url().or(z.literal('')),
});

export function UserProfilePage() {
  const { user } = useAuth();
  const { saveCustomerProfile } = useMarketplace();
  const { showToast } = useToast();
  
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      profilePhoto: '',
    },
  });

  useEffect(() => {
    if (!user || user.role !== 'user') {
      return;
    }

    // Safely access address fields with fallbacks
    reset({
      fullName: user.fullName || '',
      phone: user.phone || '',
      country: user.address?.country || '',
      state: user.address?.state || '',
      city: user.address?.city || '',
      profilePhoto: user.profilePhoto ?? '',
    });
  }, [reset, user]);

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="space-y-6 profile-fade-in">
      <DashboardTopbar
        subtitle="Maintain personal details and delivery preferences. The form structure maps cleanly to a future profile endpoint."
        title="Profile settings"
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        
        {/* ================= LEFT: PROFILE SUMMARY CARD ================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-[#0a0a0e] border border-white/10 p-8 shadow-2xl h-fit">
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Avatar Profile Picture */}
            <div className="relative group">
              {user.profilePhoto ? (
                <img 
                  alt={user.fullName} 
                  className="h-24 w-24 rounded-[20px] object-cover border-2 border-white/10 shadow-lg" 
                  src={user.profilePhoto} 
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-[20px] bg-white/5 border border-white/10 shadow-inner">
                  <UserCircle2 className="h-10 w-10 text-white/30" />
                </div>
              )}
            </div>

            <div className="mt-2 sm:mt-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
                Customer Profile
              </p>
              <p className="font-display text-3xl font-bold text-white tracking-tight">
                {user.fullName}
              </p>
              <p className="mt-1 text-sm font-medium text-white/50">
                {user.email}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="relative z-10 mt-8 flex flex-wrap justify-center sm:justify-start gap-3">
            <Badge className="bg-white/5 border border-white/10 text-white/80 px-3 py-1.5 shadow-sm" variant="neutral">
              <MapPin className="mr-2 h-3.5 w-3.5 text-orange-400" />
              {user.address?.city || 'No City'}, {user.address?.state || 'No State'}
            </Badge>
            <Badge className="bg-white/5 border border-white/10 text-white/80 px-3 py-1.5 shadow-sm" variant="neutral">
              <Camera className="mr-2 h-3.5 w-3.5 text-pink-400" />
              Optional profile photo
            </Badge>
          </div>
        </div>

        {/* ================= RIGHT: EDIT FORM CARD ================= */}
        <div className="rounded-[32px] bg-black/40 border border-white/10 p-8 backdrop-blur-xl shadow-inner">
          
          {/* Custom Dark Header (Bypassing standard SectionHeader) */}
          <div className="mb-8 border-b border-white/5 pb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
              Account Settings
            </p>
            <h2 className="font-display text-2xl font-bold text-white">
              Edit customer profile
            </h2>
            <p className="mt-2 text-sm text-white/50 font-medium">
              Any edits are reflected immediately across the customer workspace and database.
            </p>
          </div>

          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={handleSubmit(async (values) => {
              try {
                await saveCustomerProfile(user.id, {
                  fullName: values.fullName,
                  phone: values.phone,
                  address: {
                    country: values.country,
                    state: values.state,
                    city: values.city,
                  },
                  profilePhoto: values.profilePhoto || undefined,
                });
                showToast({
                  title: 'Profile updated',
                  description: 'Customer details saved successfully.',
                  variant: 'success',
                });
              } catch (error) {
                showToast({
                  title: 'Profile update failed',
                  description: error instanceof Error ? error.message : 'Please try again.',
                  variant: 'error',
                });
              }
            })}
          >
            <div className="md:col-span-2">
              <FormField error={errors.fullName?.message} label="Full Name" placeholder="e.g. Ava Customer" {...register('fullName')} />
            </div>
            
            <FormField error={errors.phone?.message} label="Phone Number" placeholder="+1 (555) 000-0000" {...register('phone')} />
            <FormField error={errors.profilePhoto?.message} label="Profile Photo URL" placeholder="https://example.com/avatar.jpg" {...register('profilePhoto')} />
            <FormField error={errors.country?.message} label="Country" placeholder="e.g. United States" {...register('country')} />
            <FormField error={errors.state?.message} label="State / Province" placeholder="e.g. California" {...register('state')} />
            
            <div className="md:col-span-2">
              <FormField error={errors.city?.message} label="City" placeholder="e.g. San Francisco" {...register('city')} />
            </div>

            <div className="md:col-span-2 mt-4 flex justify-end">
              <Button 
                loading={isSubmitting} 
                type="submit" 
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none py-6 px-8 rounded-[20px] shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] font-bold text-base"
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}