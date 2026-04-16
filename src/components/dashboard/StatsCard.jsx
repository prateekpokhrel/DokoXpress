import './StatsCard.css';

export function StatsCard({ icon: Icon, label, value, hint }) {
  return (
    // Replaced <Card> with a dark mode glass container to completely eliminate white bleed
    <div
      className="group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm cursor-default"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="absolute inset-x-6 top-0 h-16 rounded-b-full bg-gradient-to-b from-orange-500/10 to-transparent blur-2xl opacity-50 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="mt-1 font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {value}
          </p>
          {hint && (
            <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {hint}
            </p>
          )}
        </div>
        
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[16px] border text-orange-500 transition-colors duration-300 group-hover:bg-orange-50"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}