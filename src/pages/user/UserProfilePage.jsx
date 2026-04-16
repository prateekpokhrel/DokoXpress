import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, UserCircle2, Upload } from 'lucide-react';
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
  profilePhoto: z.string().optional(),
});

export function UserProfilePage() {
  const { user } = useAuth();
  const { saveCustomerProfile } = useMarketplace();
  const { showToast } = useToast();
  const [photoPreview, setPhotoPreview] = useState('');

  const {
    register,
    reset,
    setValue,
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
    if (!user || user.role !== 'user') return;

    reset({
      fullName: user.fullName || user.name || '',
      phone: user.phone || '',
      country: user.address?.country || '',
      state: user.address?.state || '',
      city: user.address?.city || '',
      profilePhoto: user.profilePhoto ?? '',
    });
    setPhotoPreview(user.profilePhoto ?? '');
  }, [reset, user]);

  if (!user || user.role !== 'user') return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result.toString();
      setPhotoPreview(result);
      setValue('profilePhoto', result);
    };
    reader.readAsDataURL(file);
  };

  const displayName = user.fullName || user.name || 'User';

  return (
    <div className="space-y-6 profile-fade-in">
      <DashboardTopbar
        subtitle="Maintain personal details and delivery preferences."
        title="Profile settings"
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">

        {/* ===== LEFT: PROFILE SUMMARY CARD ===== */}
        <div
          className="relative overflow-hidden rounded-[32px] border p-8 shadow-sm h-fit"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative group">
              <label htmlFor="profile-photo-upload" className="cursor-pointer block">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      alt={displayName}
                      className="h-24 w-24 rounded-[20px] object-cover border-2 shadow-sm"
                      style={{ borderColor: 'var(--border)' }}
                      src={photoPreview}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative grid h-24 w-24 place-items-center rounded-[20px] border shadow-sm"
                    style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                  >
                    <UserCircle2 className="h-10 w-10 text-slate-300" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
              <span className="mt-2 block text-[10px] text-center font-bold uppercase tracking-wider text-white/30">
                Click to change
              </span>
            </div>

            <div className="mt-2 sm:mt-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
                Customer Profile
              </p>
              <p className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                {displayName}
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center sm:justify-start gap-3">
            <Badge className="border px-3 py-1.5 shadow-sm" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }} variant="neutral">
              <MapPin className="mr-2 h-3.5 w-3.5 text-orange-500" />
              {user.address?.city || 'No City'}, {user.address?.state || 'No State'}
            </Badge>
            <Badge className="border px-3 py-1.5 shadow-sm" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }} variant="neutral">
              <Camera className="mr-2 h-3.5 w-3.5 text-pink-500" />
              Profile photo
            </Badge>
          </div>
        </div>

        {/* ===== RIGHT: EDIT FORM ===== */}
        <div
          className="rounded-[32px] border p-8 shadow-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="mb-8 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
              Account Settings
            </p>
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
              Edit customer profile
            </h2>
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Any edits are reflected immediately across the customer workspace.
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
              <FormField error={errors.fullName?.message} label="Full Name" placeholder="Your full name" {...register('fullName')} />
            </div>

            <FormField error={errors.phone?.message} label="Phone Number" placeholder="+977 98XXXXXXXX" {...register('phone')} />

            {/* Profile photo upload */}
            <div>
              <span className="block text-[11px] font-black uppercase tracking-[0.15em] ml-1 mb-2" style={{ color: 'var(--text-muted)' }}>
                Profile Photo
              </span>
              <label
                htmlFor="profile-photo-upload-form"
                className="group flex h-[54px] w-full cursor-pointer items-center gap-3 rounded-[18px] border px-5 transition-all outline-none focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 hover:border-orange-300"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="h-8 w-8 rounded-lg object-cover border flex-shrink-0" style={{ borderColor: 'var(--border)' }} />
                ) : (
                  <UserCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
                <span className="text-sm font-medium truncate transition-colors" style={{ color: 'var(--text-muted)' }}>
                  {photoPreview ? 'Click to change photo' : 'Upload profile photo'}
                </span>
                <Upload className="ml-auto h-4 w-4 transition-colors flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="profile-photo-upload-form"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <FormField error={errors.country?.message} label="Country" placeholder="e.g. Nepal" {...register('country')} />
            <FormField error={errors.state?.message} label="State / Province" placeholder="e.g. Koshi" {...register('state')} />

            <div className="md:col-span-2">
              <FormField error={errors.city?.message} label="City" placeholder="e.g. Biratnagar" {...register('city')} />
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