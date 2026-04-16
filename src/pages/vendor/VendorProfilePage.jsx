import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BadgeCheck, FileBadge2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { FormField } from '@/components/common/FormField';
import { SectionHeader } from '@/components/common/SectionHeader';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import { getVerificationVariant } from '@/utils/status';
import './VendorProfilePage.css';

const vendorProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
});

export function VendorProfilePage() {
  const { user } = useAuth();
  const { saveVendorProfile } = useMarketplace();
  const { showToast } = useToast();
  
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      storeName: '',
      country: '',
      state: '',
      city: '',
    },
  });

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      return;
    }

    // Safely access storeAddress fields with fallbacks to prevent crashes
    reset({
      fullName: user.fullName || '',
      phone: user.phone || '',
      storeName: user.storeName || '',
      country: user.storeAddress?.country || '',
      state: user.storeAddress?.state || '',
      city: user.storeAddress?.city || '',
    });
  }, [reset, user]);

  if (!user || user.role !== 'vendor') {
    return null;
  }

  return (
    <div className="space-y-5 vendor-page-fade-in">
      <DashboardTopbar
        subtitle="Maintain vendor identity and keep verification materials visible across your seller workspace."
        title="Vendor profile"
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        
        {/* ================= LEFT: VENDOR SUMMARY CARD ================= */}
        <Card className="bg-ink text-white vendor-card-animate">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10 shadow-inner">
              {user.verificationStatus === 'verified' ? (
                <BadgeCheck className="h-7 w-7 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-7 w-7 text-amber-400" />
              )}
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">{user.storeName}</p>
              <p className="mt-1 text-sm text-white/70">{user.email}</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant={getVerificationVariant(user.verificationStatus)}>
              {user.verificationStatus}
            </Badge>
            <Badge className="bg-white/10 text-white border border-white/5" variant="neutral">
              {user.storeAddress?.city || 'No City'}, {user.storeAddress?.state || 'No State'}
            </Badge>
          </div>
          
          <div className="mt-8 space-y-4 rounded-3xl bg-white/5 border border-white/10 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <FileBadge2 className="mt-1 h-5 w-5 text-orange-400" />
              <div>
                <p className="font-semibold text-white">Citizenship document</p>
                <p className="mt-1 text-sm text-white/50">{user.citizenshipDocument ?? 'Not uploaded'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileBadge2 className="mt-1 h-5 w-5 text-orange-400" />
              <div>
                <p className="font-semibold text-white">Store license</p>
                <p className="mt-1 text-sm text-white/50">{user.storeLicense ?? 'Not uploaded'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ================= RIGHT: UPDATE FORM CARD ================= */}
        <Card className="vendor-card-animate" style={{ animationDelay: '100ms' }}>
          <SectionHeader
            description="Fields here mirror a vendor profile update workflow and keep store information consistent across the platform."
            eyebrow="Store profile"
            title="Update seller details"
          />
          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(async (values) => {
              try {
                await saveVendorProfile(user.id, {
                  fullName: values.fullName,
                  phone: values.phone,
                  storeName: values.storeName,
                  storeAddress: {
                    country: values.country,
                    state: values.state,
                    city: values.city,
                  },
                });
                showToast({
                  title: 'Vendor profile updated',
                  description: 'Store information saved successfully.',
                  variant: 'success',
                });
              } catch (error) {
                showToast({
                  title: 'Update failed',
                  description: error instanceof Error ? error.message : 'Please try again.',
                  variant: 'error',
                });
              }
            })}
          >
            <div className="md:col-span-2">
              <FormField error={errors.fullName?.message} label="Owner Full Name" placeholder="e.g. John Doe" {...register('fullName')} />
            </div>
            
            <FormField error={errors.phone?.message} label="Phone Number" placeholder="+1 (555) 000-0000" {...register('phone')} />
            <FormField error={errors.storeName?.message} label="Store Name" placeholder="e.g. Fresh Foods Market" {...register('storeName')} />
            <FormField error={errors.country?.message} label="Country" placeholder="e.g. United States" {...register('country')} />
            <FormField error={errors.state?.message} label="State" placeholder="e.g. California" {...register('state')} />
            
            <div className="md:col-span-2">
              <FormField error={errors.city?.message} label="City" placeholder="e.g. Los Angeles" {...register('city')} />
            </div>
            
            <div className="md:col-span-2 mt-4 flex justify-end">
              <Button loading={isSubmitting} type="submit" variant="secondary" className="transition-transform hover:scale-[1.02]">
                Save vendor profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}