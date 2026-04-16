import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/navigation/PublicNavbar';
import './PublicLayout.css';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-sand bg-mesh">
      <PublicNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
