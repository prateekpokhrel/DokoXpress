import { ArrowRight, ShieldCheck, ShoppingBag, Store, TimerReset, Zap } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { DASHBOARD_HOME } from '@/utils/constants';
import './HomePage.css';

export function HomePage() {
  const { role, session } = useAuth();
  const { snapshot } = useMarketplace();
  const navigate = useNavigate();

  if (role && session) {
    return <Navigate replace to={DASHBOARD_HOME[role]} />;
  }

  const products = snapshot?.products?.length ?? 0;
  const vendors = snapshot?.vendors?.length ?? 0;
  const admins = snapshot?.admins?.length ?? 1;

  return (
    <div className="hp-root">

      {/* ── HERO ── */}
      <section className="hp-hero">

        {/* Ambient glow orbs */}
        <div className="hp-orb hp-orb--amber" />
        <div className="hp-orb hp-orb--rose" />
        <div className="hp-orb hp-orb--blue" />

        {/* Subtle grid overlay */}
        <div className="hp-grid-overlay" />

        <div className="hp-hero-inner">

          {/* ── LEFT COLUMN ── */}
          <div className="hp-hero-left">

            <div className="hp-badge-wrap hp-anim hp-anim--1">
              <span className="hp-pulse-dot" />
              <span className="hp-badge-text">⚡ 15-Min Fast Delivery Enabled</span>
            </div>

            <h1 className="hp-headline hp-anim hp-anim--2">
              Multi-vendor commerce
              <br />
              <span className="hp-headline-gradient">
                with lightning fast delivery
              </span>
            </h1>

            <p className="hp-subheadline hp-anim hp-anim--3">
              Unified platform for customers, vendors, and admins.
              Built for speed, scale, and real-time commerce.
            </p>

            <div className="hp-cta-row hp-anim hp-anim--4">
              <button
                className="hp-btn-primary"
                onClick={() => navigate('/signup')}
              >
                <span>Get Started</span>
                <ArrowRight className="hp-btn-icon" />
              </button>

              <button
                className="hp-btn-ghost"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>

            {/* Trust pills */}
            <div className="hp-trust-row hp-anim hp-anim--5">
              {['No Setup Fee', 'Real-time Sync', 'Secure Payments'].map(t => (
                <span key={t} className="hp-trust-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT STAT GRID ── */}
          <div className="hp-stat-grid hp-anim hp-anim--3">
            <StatCard
              icon={<ShoppingBag className="hp-stat-icon hp-stat-icon--amber" />}
              value="10k+"
              label="Products Listed"
              imagePath="/images/malsaman.jpg"
              accent="amber"
            />
            <StatCard
              icon={<Store className="hp-stat-icon hp-stat-icon--teal" />}
              value="60+"
              label="Active Vendors"
              imagePath="/images/nike.png"
              accent="teal"
            />
            <StatCard
              icon={<ShieldCheck className="hp-stat-icon hp-stat-icon--blue" />}
              value={`${admins}`}
              label="Platform Admins"
              imagePath="/images/admin.jpg"
              accent="blue"
            />
            <StatCard
              icon={<TimerReset className="hp-stat-icon hp-stat-icon--emerald" />}
              value="15 min"
              label="Avg. Delivery"
              imagePath="/images/delivery.jpg"
              accent="emerald"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION LABEL ── */}
      <div className="hp-section-eyebrow">
        <span className="hp-section-line" />
        <span className="hp-section-label-text">Platform Roles</span>
        <span className="hp-section-line" />
      </div>

      {/* ── FEATURES ── */}
      <section className="hp-features">
        <FeatureCard
          role="Customer"
          emoji="🛍️"
          title="Discover & Order"
          description="Browse thousands of products and check out instantly with ultra-fast, frictionless ordering."
          gradient="hp-feat--customer"
          route="/login"
          delay={1}
        />
        <FeatureCard
          role="Vendor"
          emoji="🏪"
          title="Seller Dashboard"
          description="Upload products, manage your inventory, set prices, and track every order in real time."
          gradient="hp-feat--vendor"
          route="/vendor"
          delay={2}
        />
        <FeatureCard
          role="Admin"
          emoji="🛡️"
          title="Platform Control"
          description="Approve vendors, oversee transactions, and monitor system health with live analytics."
          gradient="hp-feat--admin"
          route="/admin"
          delay={3}
        />
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="hp-marquee-wrap">
        <div className="hp-marquee-track">
          {[
            'Real-time Orders', 'Multi-vendor', 'Fast Delivery', 'Secure Checkout',
            'Live Analytics', 'Vendor Approval', 'Product Sync', 'Smart Routing',
            'Real-time Orders', 'Multi-vendor', 'Fast Delivery', 'Secure Checkout',
            'Live Analytics', 'Vendor Approval', 'Product Sync', 'Smart Routing',
          ].map((item, i) => (
            <span key={i} className="hp-marquee-item">
              <Zap className="hp-marquee-icon" />{item}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}


/* ═══════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════ */
function StatCard({ icon, value, label, imagePath, accent }) {
  return (
    <div className={`hp-stat-card hp-stat-card--${accent}`}>

      {/* Background image */}
      <div
        className="hp-stat-bg"
        style={{ backgroundImage: `url(${imagePath})` }}
      />

      {/* Gradient overlay */}
      <div className="hp-stat-overlay" />

      {/* Shimmer on hover */}
      <div className="hp-stat-shimmer" />

      {/* Content */}
      <div className="hp-stat-content">
        <div className="hp-stat-meta">
          {icon}
          <span className="hp-stat-label">{label}</span>
        </div>
        <p className="hp-stat-value">{value}</p>
      </div>

      {/* Corner accent */}
      <div className={`hp-stat-corner hp-stat-corner--${accent}`} />
    </div>
  );
}


/* ═══════════════════════════════════════════
   FEATURE CARD
═══════════════════════════════════════════ */
function FeatureCard({ role, emoji, title, description, gradient, route, delay }) {
  const navigate = useNavigate();
  return (
    <div
      className={`hp-feat-card ${gradient} hp-anim hp-anim--${delay}`}
      onClick={() => navigate(route)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(route)}
    >
      {/* Background noise layer */}
      <div className="hp-feat-noise" />

      {/* Glow blob */}
      <div className="hp-feat-glow" />

      <div className="hp-feat-body">
        <span className="hp-feat-emoji">{emoji}</span>

        <p className="hp-feat-role">{role}</p>
        <h3 className="hp-feat-title">{title}</h3>
        <p className="hp-feat-desc">{description}</p>

        <div className="hp-feat-cta">
          <span>Explore</span>
          <ArrowRight className="hp-feat-arrow" />
        </div>
      </div>
    </div>
  );
}