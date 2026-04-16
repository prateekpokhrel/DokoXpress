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

// ==========================================
// SECURITY: Define your master admin email here
// ==========================================
const MASTER_ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || 'dokoxpress.admin@email.com';

export function LoginPage() {
  const { role, session, loginWithPassword, loginWithGoogle, isAuthBusy } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'user',
      email: 'ava.customer@dokoxpress.com',
      password: 'Password@123',
      remember: true,
    },
  });

  const selectedRole = watch('role');

  if (role && session) {
    const destination = DASHBOARD_HOME[role] || '/';
    return <Navigate replace to={destination} />;
  }

  async function handleGoogleLogin() {
    try {
      // ==========================================
      // PROTECTION: Disable Google Auth for Admin
      // ==========================================
      if (selectedRole === 'admin') {
        throw new Error("Admin access via Google is disabled for security. Please use your credentials.");
      }

      const remember = watch('remember');
      await loginWithGoogle(selectedRole, remember);
      showToast({
        title: 'Signed in with Google',
        description: `${ROLE_LABELS[selectedRole]} access is ready.`,
        variant: 'success',
      });
      navigate(DASHBOARD_HOME[selectedRole]);
    } catch (error) {
      showToast({
        title: 'Sign-in restricted',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      });
    }
  }

  const getRoleActiveClasses = (candidate) => {
    if (selectedRole !== candidate) {
      return 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5';
    }
    
    switch (candidate) {
      case 'user':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
      case 'vendor':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.15)]';
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <AuthLayout
      aside={<AccessCredentialsCard />}
      footerLinkLabel="Create an account"
      footerLinkTo="/signup"
      footerText="Need a new account?"
      subtitle="Choose your role, sign in with your credentials, or continue with Google."
      title="Login to your workspace"
    >
      <div className="space-y-8">
        
        {/* ================= PREMIUM ROLE SELECTOR ================= */}
        <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-black/40 p-2 border border-white/10 backdrop-blur-xl shadow-inner">
          {['user', 'vendor', 'admin'].map((candidate) => (
            <label
              key={candidate}
              className={`cursor-pointer rounded-[18px] px-3 py-3 text-center text-sm font-bold tracking-wide transition-all duration-300 border ${getRoleActiveClasses(candidate)}`}
            >
              <input className="hidden" type="radio" value={candidate} {...register('role')} />
              {ROLE_LABELS[candidate]}
            </label>
          ))}
        </div>

        {/* ================= FORM ================= */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit(async (values) => {
            try {
              // ==========================================
              // PROTECTION: Block unauthorized admin logins
              // ==========================================
              if (values.role === 'admin' && values.email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
                throw new Error("Access Denied: You do not have permission to access the admin workspace.");
              }

              await loginWithPassword(values);
              showToast({
                title: 'Login successful',
                description: `${ROLE_LABELS[values.role]} dashboard ready.`,
                variant: 'success',
              });
              navigate(DASHBOARD_HOME[values.role]);
            } catch (error) {
              showToast({
                title: 'Login failed',
                description: error instanceof Error ? error.message : 'Please try again.',
                variant: 'error',
              });
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
          
          {/* Glowing Glassmorphism Checkbox */}
          <label className="group flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input 
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-black/50 transition-all checked:border-orange-500 checked:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-1 focus:ring-offset-black" 
                type="checkbox" 
                {...register('remember')} 
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Keep me signed in on this device
          </label>

          <Button 
            fullWidth 
            loading={isAuthBusy} 
            type="submit" 
            className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none py-6 rounded-[20px] shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] font-bold text-lg mt-4"
          >
            Access Workspace
          </Button>
        </form>

        {/* ================= PREMIUM DIVIDER ================= */}
        <div className="flex items-center gap-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <span>Or proceed with</span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/10 to-transparent" />
        </div>

        {/* ================= GOOGLE LOGIN ================= */}
        <div className="hover:scale-[1.02] transition-transform duration-300">
          <GoogleLoginButton 
            label={`Continue as ${ROLE_LABELS[selectedRole]}`} 
            loading={isAuthBusy} 
            onClick={handleGoogleLogin} 
          />
        </div>
      </div>
    </AuthLayout>
  );
}