import { Users } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatDate } from '@/utils/format';
import './AdminUsersPage.css';

export function AdminUsersPage() {
  const { users, isHydrating } = useMarketplace();

  return (
    <div className="space-y-5">
      <DashboardTopbar
        subtitle="Inspect registered customers and prepare this surface for backend-backed moderation or support workflows."
        title="Platform users"
      />

      <SectionHeader
        description="User rows expand automatically as more customers create accounts through the platform."
        eyebrow="Customers"
        title="All customer accounts"
      />

      {isHydrating ? (
        <Skeleton className="h-[320px] rounded-[28px]" />
      ) : users.length ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Phone</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-ink">{user.fullName}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{user.address.city}, {user.address.state}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState description="Customer accounts will appear here as soon as new registrations start coming in." icon={Users} title="No users yet" />
      )}
    </div>
  );
}
