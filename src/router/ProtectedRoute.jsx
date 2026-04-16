import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { DASHBOARD_HOME } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';
import './ProtectedRoute.css';

export function ProtectedRoute({ allowedRoles }) {
  const { role, session, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-sand">
        <div className="rounded-3xl border border-white/60 bg-white/80 px-6 py-5 text-sm text-slate-600 shadow-soft">
          Restoring your workspace...
        </div>
      </div>
    );
  }

  if (!session || !role) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate replace to={DASHBOARD_HOME[role]} />;
  }

  return <Outlet />;
}
