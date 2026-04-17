import { ShieldAlert, LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function PendingVerification() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20" />
        <div className="relative rounded-full bg-orange-50 p-6">
          <Clock className="h-16 w-16 text-orange-500" />
        </div>
      </div>

      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        Verification Pending
      </h1>
      
      <p className="mt-4 max-w-lg text-lg font-medium text-slate-500">
        Hi <span className="text-orange-600 font-bold">{user?.name || 'Partner'}</span>, your vendor application is currently under review by our moderation team.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <ShieldAlert className="mx-auto mb-4 h-8 w-8 text-blue-500" />
          <h3 className="font-bold text-ink">What happens next?</h3>
          <p className="mt-2 text-sm text-slate-500">
            We confirm your store license and documents. This usually takes 24-48 hours.
          </p>
        </div>
        
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <Clock className="mx-auto mb-4 h-8 w-8 text-emerald-500" />
          <h3 className="font-bold text-ink">Access Restricted</h3>
          <p className="mt-2 text-sm text-slate-500">
            Once verified, your full dashboard and product listings will be enabled automatically.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Button 
          variant="secondary"
          onClick={() => window.location.reload()}
          className="px-8"
        >
          Check Status Again
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="text-red-500 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout for now
        </Button>
      </div>
      
      <p className="mt-12 text-xs uppercase tracking-widest text-slate-400">
        DokoXpress Trust & Safety Team
      </p>
    </div>
  );
}
