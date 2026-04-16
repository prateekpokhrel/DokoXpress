import './StatsCard.css';

export function StatsCard({ icon: Icon, label, value, hint }) {
  return (
    // Replaced <Card> with a dark mode glass container to completely eliminate white bleed
    <div className="stat-card-glow group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0e] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#0f0f13] cursor-default">
      
      {/* Subtle Top Inner Glow: Changed from solid orange-100 to a dark-mode friendly ambient gradient */}
      <div className="absolute inset-x-6 top-0 h-16 rounded-b-full bg-gradient-to-b from-orange-500/20 to-transparent blur-2xl opacity-50 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1 drop-shadow-sm transition-colors group-hover:text-white/70">
            {label}
          </p>
          <p className="mt-1 font-display text-4xl font-bold tracking-tight text-white drop-shadow-md">
            {value}
          </p>
          {hint && (
            <p className="mt-2 text-sm font-medium text-white/40">
              {hint}
            </p>
          )}
        </div>
        
        {/* Icon Wrapper: Upgraded to a frosted glass square with a glowing icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-orange-400 shadow-inner transition-colors duration-300 group-hover:bg-orange-500/10 group-hover:text-orange-300">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}