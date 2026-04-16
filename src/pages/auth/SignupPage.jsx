import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { FileUploadField } from '@/components/common/FileUploadField';
import { FormField } from '@/components/common/FormField';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { adminSignupSchema, customerSignupSchema, vendorSignupSchema } from '@/schemas/authSchemas';
import { fileToDataUrl } from '@/utils/files';
import { DASHBOARD_HOME, ROLE_LABELS } from '@/utils/constants';
import './SignupPage.css';

// ==========================================
// SECURITY: Define your master admin email here
// ==========================================
const MASTER_ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || 'dokoxpress.admin@email.com';

export function SignupPage() {
  const { role, session, signupAsCustomer, signupAsVendor, signupAsAdmin, loginWithGoogle, isAuthBusy } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [signupRole, setSignupRole] = useState('user');

  const customerForm = useForm({
    resolver: zodResolver(customerSignupSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', password: 'Password@123',
      country: 'India', state: 'Odisha', city: 'Bhubaneswar', remember: true,
    },
  });

  const vendorForm = useForm({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', password: 'Password@123',
      storeName: '', country: 'India', state: 'Odisha', city: 'Bhubaneswar', remember: true,
    },
  });

  const adminForm = useForm({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', password: 'Password@123',
      department: 'Platform Operations', remember: true,
    },
  });

  useEffect(() => {
    customerForm.reset();
    vendorForm.reset();
    adminForm.reset();
  }, [signupRole, customerForm, vendorForm, adminForm]);

  if (role && session) {
    return <Navigate replace to={DASHBOARD_HOME[role]} />;
  }

  return (
    <AuthLayout
      aside={
        <div className="space-y-6 signup-aside-fade">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-4">
              Onboarding protocols
            </p>
            <div className="space-y-4 text-sm font-medium text-white/60">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                <p>Customers gain immediate access to the marketplace.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                <p>Vendors require document verification before listing products.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                <p>Admins handle regional logistics and vendor approvals.</p>
              </div>
            </div>
          </div>
          
          {signupRole === 'vendor' && (
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 py-3 w-full justify-center" variant="warning">
              Initial status: Pending Verification
            </Badge>
          )}
        </div>
      }
      footerLinkLabel="Go to login"
      footerLinkTo="/login"
      footerText="Already have an account?"
      subtitle="Join the local commerce network. Select your role to get started."
      title="Create your account"
    >
      <div className="space-y-8">
        {/* ================= ROLE SELECTOR TABS ================= */}
        <div className="role-tab-bar grid grid-cols-3 gap-2 rounded-[20px] bg-white/5 border border-white/10 p-1.5 backdrop-blur-md">
          {['user', 'vendor', 'admin'].map((candidate) => (
            <button
              key={candidate}
              className={`rounded-[14px] py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                signupRole === candidate 
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-[1.02]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setSignupRole(candidate)}
              type="button"
            >
              {ROLE_LABELS[candidate]}
            </button>
          ))}
        </div>

        {/* ================= FORMS ================= */}
        <div className="signup-form-container">
          {signupRole === 'user' ? (
            <form
              className="grid gap-5 md:grid-cols-2 animate-in"
              onSubmit={customerForm.handleSubmit(async (values) => {
                try {
                  const photoFile = values.profilePhoto?.[0];
                  const profilePhoto = photoFile ? await fileToDataUrl(photoFile) : undefined;

                  await signupAsCustomer({
                    ...values,
                    address: { country: values.country, state: values.state, city: values.city },
                    profilePhoto,
                  });
                  showToast({ title: 'Success', description: 'Shopping workspace ready.', variant: 'success' });
                  navigate('/user/products');
                } catch (error) {
                  showToast({ title: 'Error', description: error.message, variant: 'error' });
                }
              })}
            >
              <div className="md:col-span-2">
                <FormField error={customerForm.formState.errors.fullName?.message} label="Full Name" {...customerForm.register('fullName')} />
              </div>
              <FormField error={customerForm.formState.errors.email?.message} label="Email" type="email" {...customerForm.register('email')} />
              <FormField error={customerForm.formState.errors.phone?.message} label="Phone Number" {...customerForm.register('phone')} />
              <FormField error={customerForm.formState.errors.country?.message} label="Country" {...customerForm.register('country')} />
              <FormField error={customerForm.formState.errors.state?.message} label="State" {...customerForm.register('state')} />
              <div className="md:col-span-2">
                <FormField error={customerForm.formState.errors.city?.message} label="City" {...customerForm.register('city')} />
              </div>
              <div className="md:col-span-2">
                <FormField error={customerForm.formState.errors.password?.message} label="Password" type="password" {...customerForm.register('password')} />
              </div>
              <div className="md:col-span-2">
                <FileUploadField
                  error={customerForm.formState.errors.profilePhoto?.message}
                  fileName={customerForm.watch('profilePhoto')?.[0]?.name}
                  helper="JPG/PNG up to 2MB"
                  label="Profile Photo (Optional)"
                  {...customerForm.register('profilePhoto')}
                />
              </div>
              <label className="checkbox-wrapper md:col-span-2">
                <input type="checkbox" {...customerForm.register('remember')} />
                <span>Save session on this device</span>
              </label>
              <div className="md:col-span-2 space-y-4 pt-2">
                <Button fullWidth loading={isAuthBusy} type="submit" variant="secondary">Create Customer Account</Button>
                <GoogleLoginButton label="Continue with Google" loading={isAuthBusy} onClick={() => loginWithGoogle('user', true)} />
              </div>
            </form>
          ) : signupRole === 'vendor' ? (
            <form
              className="grid gap-5 md:grid-cols-2 animate-in"
              onSubmit={vendorForm.handleSubmit(async (values) => {
                try {
                  await signupAsVendor({
                    ...values,
                    storeAddress: { country: values.country, state: values.state, city: values.city },
                    citizenshipDocument: values.citizenshipDocument?.[0]?.name,
                    storeLicense: values.storeLicense?.[0]?.name,
                  });
                  showToast({ title: 'Success', description: 'Vendor account created.', variant: 'success' });
                  navigate('/vendor/products');
                } catch (error) {
                  showToast({ title: 'Error', description: error.message, variant: 'error' });
                }
              })}
            >
              <div className="md:col-span-2">
                <FormField error={vendorForm.formState.errors.fullName?.message} label="Owner Name" {...vendorForm.register('fullName')} />
              </div>
              <FormField error={vendorForm.formState.errors.email?.message} label="Work Email" type="email" {...vendorForm.register('email')} />
              <FormField error={vendorForm.formState.errors.phone?.message} label="Phone" {...vendorForm.register('phone')} />
              <div className="md:col-span-2">
                <FormField error={vendorForm.formState.errors.storeName?.message} label="Store Name" {...vendorForm.register('storeName')} />
              </div>
              <FormField error={vendorForm.formState.errors.country?.message} label="Country" {...vendorForm.register('country')} />
              <FormField error={vendorForm.formState.errors.state?.message} label="State" {...vendorForm.register('state')} />
              <div className="md:col-span-2">
                <FormField error={vendorForm.formState.errors.city?.message} label="City" {...vendorForm.register('city')} />
              </div>
              <div className="md:col-span-2">
                <FormField error={vendorForm.formState.errors.password?.message} label="Password" type="password" {...vendorForm.register('password')} />
              </div>
              <FileUploadField
                error={vendorForm.formState.errors.citizenshipDocument?.message}
                fileName={vendorForm.watch('citizenshipDocument')?.[0]?.name}
                label="Government ID"
                {...vendorForm.register('citizenshipDocument')}
              />
              <FileUploadField
                error={vendorForm.formState.errors.storeLicense?.message}
                fileName={vendorForm.watch('storeLicense')?.[0]?.name}
                label="Trade License"
                {...vendorForm.register('storeLicense')}
              />
              <label className="checkbox-wrapper md:col-span-2">
                <input type="checkbox" {...vendorForm.register('remember')} />
                <span>Verify merchant identity on login</span>
              </label>
              <div className="md:col-span-2 pt-2">
                <Button fullWidth loading={isAuthBusy} type="submit" variant="secondary">Submit Vendor Application</Button>
              </div>
            </form>
          ) : (
            <form
              className="grid gap-5 md:grid-cols-2 animate-in"
              onSubmit={adminForm.handleSubmit(async (values) => {
                try {
                  // ==========================================
                  // PROTECTION: Block unauthorized admin signups
                  // ==========================================
                  if (values.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
                    throw new Error("Access Denied: Admin registration is restricted to authorized personnel only.");
                  }

                  await signupAsAdmin(values);
                  navigate('/admin/overview');
                } catch (error) {
                  showToast({ title: 'Error', description: error.message, variant: 'error' });
                }
              })}
            >
              <div className="md:col-span-2">
                <FormField error={adminForm.formState.errors.fullName?.message} label="Admin Full Name" {...adminForm.register('fullName')} />
              </div>
              <FormField error={adminForm.formState.errors.email?.message} label="Admin Email" type="email" {...adminForm.register('email')} />
              <FormField error={adminForm.formState.errors.phone?.message} label="Phone" {...adminForm.register('phone')} />
              <div className="md:col-span-2">
                <FormField error={adminForm.formState.errors.department?.message} label="Management Department" {...adminForm.register('department')} />
              </div>
              <div className="md:col-span-2">
                <FormField error={adminForm.formState.errors.password?.message} label="Secure Password" type="password" {...adminForm.register('password')} />
              </div>
              <label className="checkbox-wrapper md:col-span-2">
                <input type="checkbox" {...adminForm.register('remember')} />
                <span>Enforce session security</span>
              </label>
              <div className="md:col-span-2 pt-2">
                <Button fullWidth loading={isAuthBusy} type="submit" variant="secondary">Authorize Admin Access</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}