import './SectionHeader.css';

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
      <div>
        {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500 drop-shadow-sm">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}