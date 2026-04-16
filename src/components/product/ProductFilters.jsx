import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import './ProductFilters.css';

export function ProductFilters({ filters, locations, onChange }) {
  return (
    <div className="surface-panel grid gap-4 p-4 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))] rounded-[28px] bg-[#0a0a0e] border border-white/5 shadow-lg">

      {/* ================= SEARCH BAR ================= */}
      <label className="search-wrapper flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50">
        
        <Search className="h-4 w-4 text-gray-400" />

        <input
          type="text"
          autoComplete="off"
          className="search-input"
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          
          value={filters.query}
        />
      </label>

      {/* ================= CATEGORY ================= */}
      <select
        className="filter-select rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 cursor-pointer"
        onChange={(event) => onChange({ ...filters, category: event.target.value })}
        value={filters.category}
      >
        <option value="all">All categories</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* ================= LOCATION ================= */}
      <select
        className="filter-select rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 cursor-pointer"
        onChange={(event) => onChange({ ...filters, location: event.target.value })}
        value={filters.location}
      >
        <option value="all">All locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* ================= BUTTON ================= */}
      <Button
        className={`flex items-center justify-center gap-2 rounded-2xl border transition-all duration-300 ${
          filters.fastOnly 
            ? 'border-orange-500/50 bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onChange({ ...filters, fastOnly: !filters.fastOnly })}
        type="button"
        variant="ghost"
      >
        <SlidersHorizontal className="h-4 w-4" />
        15-min only
      </Button>
    </div>
  );
}