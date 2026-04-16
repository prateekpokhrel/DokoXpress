import { Link } from 'react-router-dom';
import './AuthLayout.css';

export function AuthLayout({
  title,
  subtitle,
  aside,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}) {
  return (
    <div className="grid min-h-[calc(100vh-140px)] gap-6 lg:grid-cols-[1.05fr_0.95fr] auth-fade-in">

      {/* LEFT PANEL — decorative / info side */}
      <section
        className="relative overflow-hidden rounded-[32px] px-6 py-8 shadow-sm sm:px-10 sm:py-10 border"
        style={{ backgroundColor: '#fff7f0', borderColor: '#fde8d5' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.08),transparent_50%)] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-500">
            DokoXpress access
          </p>
          <h1 className="mt-4 max-w-lg font-display text-4xl font-bold leading-[1.15] tracking-tight" style={{ color: 'var(--text-main)' }}>
            Move faster with a storefront built for customers, sellers, and operators.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
            DokoXpress is designed with a clean service layer, secure auth boundaries, and a layout that is ready for connected platform workflows.
          </p>
          <div className="mt-10">{aside}</div>
        </div>
      </section>

      {/* RIGHT PANEL — form */}
      <section
        className="relative flex items-center justify-center p-6 sm:p-8 rounded-[32px] border overflow-hidden shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="w-full max-w-md relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500">
            Welcome back
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {title}
          </h2>
          <p className="mt-3 text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {footerText}{' '}
            <Link
              className="font-bold text-orange-500 hover:text-orange-600 hover:underline underline-offset-4 transition-all"
              to={footerLinkTo}
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </section>

    </div>
  );
}