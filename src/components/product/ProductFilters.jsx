import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/utils/constants';

const selectStyle = {
  backgroundColor: 'var(--bg-subtle)',
  border: '1px solid var(--border)',
  color: 'var(--text-main)',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  cursor: 'pointer',
  appearance: 'none',
};

export function ProductFilters({ filters, locations, onChange }) {
  return (
    <div
      className="grid gap-3 p-4 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))] rounded-[20px] shadow-sm border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* SEARCH */}
      <label
        className="flex items-center gap-3 rounded-[12px] border px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-orange-500/30"
        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
      >
        <Search className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search products..."
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-main)' }}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          value={filters.query}
        />
      </label>

      {/* CATEGORY */}
      <div className="relative">
        <select
          style={selectStyle}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          value={filters.category}
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>

      {/* LOCATION */}
      <div className="relative">
        <select
          style={selectStyle}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          value={filters.location}
        >
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>

      {/* FAST DELIVERY TOGGLE */}
      <button
        className={`flex items-center justify-center gap-2 rounded-[12px] border text-sm font-bold transition-all duration-200 py-3 px-4 ${
          filters.fastOnly
            ? 'bg-orange-500 text-white border-orange-500'
            : 'hover:bg-slate-50'
        }`}
        style={filters.fastOnly ? {} : { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
        onClick={() => onChange({ ...filters, fastOnly: !filters.fastOnly })}
        type="button"
      >
        <SlidersHorizontal className="h-4 w-4" />
        15-min only
      </button>
    </div>
  );
}