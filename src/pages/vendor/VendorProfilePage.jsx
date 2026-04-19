import { useEffect, useState } from 'react';
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
  citizenshipDocument: z.string().optional(),
  storeLicense: z.string().optional(),
});

export function VendorProfilePage() {
  const { user } = useAuth();
  const { saveVendorProfile } = useMarketplace();
  const { showToast } = useToast();

  const [citizenshipPreview, setCitizenshipPreview] = useState('');
  const [licensePreview, setLicensePreview] = useState('');

  const {
    register,
    reset,
    setValue,
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
      citizenshipDocument: '',
      storeLicense: '',
    },
  });

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      return;
    }

    reset({
      fullName: user.fullName || '',
      phone: user.phone || '',
      storeName: user.storeName || '',
      country: user.storeAddress?.country || '',
      state: user.storeAddress?.state || '',
      city: user.storeAddress?.city || '',
      citizenshipDocument: user.citizenshipDocument || '',
      storeLicense: user.storeLicense || '',
    });
    setCitizenshipPreview(user.citizenshipDocument || '');
    setLicensePreview(user.storeLicense || '');
  }, [reset, user]);

  if (!user || user.role !== 'vendor') {
    return null;
  }

  const handleDocumentChange = (field, setPreview) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result.toString();
      setPreview(result);
      setValue(field, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 vendor-page-fade-in">
      <DashboardTopbar
        subtitle="Maintain vendor identity and keep verification materials visible across your seller workspace."
        title="Vendor profile"
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT: VENDOR SUMMARY CARD */}
        <Card
          className="border p-8 shadow-sm flex flex-col vendor-card-animate"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl border shadow-sm"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
              {user.verificationStatus === 'verified' ? (
                <BadgeCheck className="h-8 w-8 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>{user.storeName}</p>
              <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant={getVerificationVariant(user.verificationStatus)}>
              {user.verificationStatus}
            </Badge>
            <Badge className="border shadow-sm" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }} variant="neutral">
              {user.storeAddress?.city || 'No City'}, {user.storeAddress?.state || 'No State'}
            </Badge>
          </div>

          <div
            className="mt-8 space-y-4 rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <FileBadge2 className="mt-1 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Citizenship document</p>
                <p className="mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {user.citizenshipDocument ? 'Document attached.' : 'Not uploaded yet.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 pt-2">
              <FileBadge2 className="mt-1 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Store license</p>
                <p className="mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {user.storeLicense ? 'License attached.' : 'Not uploaded yet.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* RIGHT: UPDATE FORM CARD */}
        <Card
          className="border shadow-sm vendor-card-animate"
          style={{ animationDelay: '100ms', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
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
                  citizenshipDocument: values.citizenshipDocument || undefined,
                  storeLicense: values.storeLicense || undefined,
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

            <FormField error={errors.phone?.message} label="Phone Number" placeholder="+977 9865 9865 98" {...register('phone')} />
            <FormField error={errors.storeName?.message} label="Store Name" placeholder="e.g. Bhatbhateni" {...register('storeName')} />
            <FormField error={errors.country?.message} label="Country" placeholder="e.g. Nepal" {...register('country')} />
            <FormField error={errors.state?.message} label="District" placeholder="e.g. Morang" {...register('district')} />

            <div className="md:col-span-2">
              <FormField error={errors.city?.message} label="City" placeholder="e.g. Biratnagar" {...register('city')} />
            </div>

            <div className="md:col-span-2 mt-2">
              <span className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Citizenship Document</span>
              <label className="flex items-center justify-center w-full h-24 px-4 transition border-2 border-dashed rounded-xl appearance-none cursor-pointer hover:border-orange-400 focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-slate-600">
                    {citizenshipPreview ? 'Document selected (click to change)' : 'Drop files to Attach, or browse'}
                  </span>
                </span>
                <input type="file" name="file_upload" className="hidden" accept="image/*,.pdf" onChange={handleDocumentChange('citizenshipDocument', setCitizenshipPreview)} />
              </label>
            </div>

            <div className="md:col-span-2 mt-2">
              <span className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Store License / Registration</span>
              <label className="flex items-center justify-center w-full h-24 px-4 transition border-2 border-dashed rounded-xl appearance-none cursor-pointer hover:border-orange-400 focus:outline-none" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-slate-600">
                    {licensePreview ? 'License selected (click to change)' : 'Drop files to Attach, or browse'}
                  </span>
                </span>
                <input type="file" name="file_upload" className="hidden" accept="image/*,.pdf" onChange={handleDocumentChange('storeLicense', setLicensePreview)} />
              </label>
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