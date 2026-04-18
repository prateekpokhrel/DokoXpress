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
            Why DokoXpress
          </p>
          <h3
            className="mt-1 font-display text-xl font-bold"
            style={{ color: 'var(--text-main)' }}
          >
            Lightning-fast commerce experience
          </h3>
        </div>

        {/* Optional badge (kept structure intact) */}
        <div className="flex gap-2 text-xs">
          <Badge variant="secondary">Next-Gen Delivery</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        {[
          {
            title: '15-Minute Delivery',
            desc: 'Ultra-fast delivery for daily essentials in selected areas.',
            color: '#f97316',
          },
          {
            title: 'Multi-Vendor Marketplace',
            desc: 'Shop from multiple local vendors in one seamless platform.',
            color: '#0d9488',
          },
          {
            title: 'Real-Time Order Tracking',
            desc: 'Track your orders live from store to doorstep.',
            color: '#2563eb',
          },
          {
            title: 'Smart Inventory System',
            desc: 'Vendors manage stock, pricing, and availability easily.',
            color: '#7c3aed',
          },
          {
            title: 'Secure Payments',
            desc: 'Fast and safe checkout with multiple payment options.',
            color: '#16a34a',
          },
        ].map(({ title, desc, color }) => (
          <div
            key={title}
            className="rounded-[14px] border p-4 transition-all hover:shadow-md hover:-translate-y-[2px]"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border)',
            }}
          >
            <p
              className="text-[11px] font-black uppercase tracking-wider mb-1"
              style={{ color }}
            >
              {title}
            </p>

            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}