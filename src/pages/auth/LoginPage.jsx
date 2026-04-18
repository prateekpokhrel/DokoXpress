import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AccessCredentialsCard } from '@/components/auth/AccessCredentialsCard';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { loginSchema } from '@/schemas/authSchemas';
import { DASHBOARD_HOME, ROLE_LABELS } from '@/utils/constants';
import './LoginPage.css';

const MASTER_ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || 'admin.dokoxpress@gmail.com';

const ROLE_STYLES = {
  user:   { active: 'bg-orange-500 text-white border-orange-500 shadow-sm', inactive: 'text-slate-600 border-slate-200 hover:bg-orange-50 hover:border-orange-200' },
  vendor: { active: 'bg-teal-500 text-white border-teal-500 shadow-sm',    inactive: 'text-slate-600 border-slate-200 hover:bg-teal-50 hover:border-teal-200' },
  rider:  { active: 'bg-indigo-600 text-white border-indigo-600 shadow-sm', inactive: 'text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200' },
  admin:  { active: 'bg-violet-600 text-white border-violet-600 shadow-sm', inactive: 'text-slate-600 border-slate-200 hover:bg-violet-50 hover:border-violet-200' },
};

export function LoginPage() {
  const { role, session, loginWithPassword, loginWithGoogle, isAuthBusy } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'user', email: '', password: '', remember: true },
  });

  const selectedRole = watch('role');

  if (role && session) {
    return <Navigate replace to={DASHBOARD_HOME[role] || '/'} />;
  }

  async function handleGoogleLogin() {
    try {
      if (selectedRole === 'admin') throw new Error('Admin access via Google is disabled. Use credentials.');
      const remember = watch('remember');
      await loginWithGoogle(selectedRole, remember);
      showToast({ title: 'Signed in with Google', description: `${ROLE_LABELS[selectedRole]} access ready.`, variant: 'success' });
      navigate(DASHBOARD_HOME[selectedRole]);
    } catch (error) {
      showToast({ title: 'Sign-in restricted', description: error instanceof Error ? error.message : 'Please try again.', variant: 'error' });
    }
  }

  return (
    <AuthLayout
      aside={<AccessCredentialsCard />}
      footerLinkLabel="Create an account"
      footerLinkTo="/signup"
      footerText="Need a new account?"
      subtitle="Choose your role, sign in with your credentials, or continue with Google."
      title="Login to your workspace"
    >
      <div className="space-y-6">

        {/* ROLE SELECTOR */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 rounded-[18px] p-1.5 border"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
        >
          {['user', 'vendor', 'rider', 'admin'].map((candidate) => (
            <label
              key={candidate}
              className={`cursor-pointer rounded-[12px] px-3 py-3 text-center text-sm font-bold tracking-wide transition-all duration-200 border ${
                selectedRole === candidate ? ROLE_STYLES[candidate].active : ROLE_STYLES[candidate].inactive
              }`}
            >
              <input className="hidden" type="radio" value={candidate} {...register('role')} />
              {ROLE_LABELS[candidate]}
            </label>
          ))}
        </div>

        {/* FORM */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              if (values.role === 'admin' && values.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
                throw new Error('Access Denied: You do not have permission to access the admin workspace.');
              }
              await loginWithPassword(values);
              showToast({ title: 'Login successful', description: `${ROLE_LABELS[values.role]} dashboard ready.`, variant: 'success' });
              navigate(DASHBOARD_HOME[values.role]);
            } catch (error) {
              showToast({ title: 'Login failed', description: error instanceof Error ? error.message : 'Please try again.', variant: 'error' });
            }
          })}
        >
          <FormField
            error={errors.email?.message}
            label="Email"
            placeholder="you@example.com"
            type="email"
            {...register('email')}
          />
          <FormField
            error={errors.password?.message}
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register('password')}
          />

          {/* Checkbox */}
          <label
            className="flex items-center gap-3 rounded-[14px] border px-4 py-3 text-sm font-medium cursor-pointer transition-all hover:bg-slate-50"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)' }}
          >
            <div className="relative flex items-center justify-center">
              <input
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all checked:border-orange-500 checked:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                style={{ borderColor: '#cbd5e1', backgroundColor: '#ffffff' }}
                type="checkbox"
                {...register('remember')}
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Keep me signed in on this device
          </label>

          <Button
            fullWidth
            loading={isAuthBusy}
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none py-6 rounded-[16px] shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] font-bold text-base mt-2 transition-all"
          >
            Access Workspace
          </Button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
          <span>Or proceed with</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        {/* GOOGLE LOGIN */}
        <GoogleLoginButton
          label={`Continue as ${ROLE_LABELS[selectedRole]}`}
          loading={isAuthBusy}
          onClick={handleGoogleLogin}
        />
      </div>
    </AuthLayout>
  );
}