import { Badge } from '@/components/common/Badge';
import { DEFAULT_PASSWORD_HINT } from '@/utils/constants';
import './AccessCredentialsCard.css';

export function AccessCredentialsCard() {
  return (
    <div
      className="rounded-[24px] border p-6 shadow-sm"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-500">
            Quick Access
          </p>
          <h3 className="mt-1 font-display text-xl font-bold" style={{ color: 'var(--text-main)' }}>
            Platform credentials
          </h3>
        </div>
        <div className="flex gap-2 text-xs">
          <div
            className="rounded-full border px-3 py-1 font-semibold"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            User/Vendor: <span className="font-mono font-bold text-teal-600">{DEFAULT_PASSWORD_HINT}</span>
          </div>
          <div
            className="rounded-full border px-3 py-1 font-semibold"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            Admin: <span className="font-mono font-bold text-purple-600">Inspiron@15</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        {[
          { role: 'Customer', email: 'ava.customer@dokoxpress.com', color: '#f97316' },
          { role: 'Vendor',   email: 'milan.vendor@dokoxpress.com', color: '#0d9488' },
          { role: 'Admin',    email: 'admin.dokoxpress@gmail.com',  color: '#7c3aed' },
        ].map(({ role, email, color }) => (
          <div
            key={role}
            className="rounded-[14px] border p-4 transition-all hover:shadow-sm"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              {role}
            </p>
            <p className="font-mono text-sm font-semibold" style={{ color }}>
              {email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}