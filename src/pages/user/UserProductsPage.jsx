import { useCallback, useEffect, useState } from 'react';
import { Clock3, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { CartSheet } from '@/components/product/CartSheet';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/format';
import './UserProductsPage.css';

const DEFAULT_FILTERS = {
  query: '',
  category: 'all',
  location: 'all',
  fastOnly: false,
};

export function UserProductsPage() {
  const { user } = useAuth();
  const {
    products,
    isHydrating,
    getUserCart,
    addItemToCart,
    changeCartQuantity,
    deleteCartItem,
    checkout,
  } = useMarketplace();
  const { showToast } = useToast();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user?.id) return;
    setCartLoading(true);
    try {
      const items = await getUserCart(user.id);
      setCartItems(items);
    } finally {
      setCartLoading(false);
    }
  }, [getUserCart, user?.id]);

  useEffect(() => {
    if (!user || user.role !== 'user') return;
    void refreshCart();
  }, [refreshCart, user]);

  if (!user || user.role !== 'user') return null;

  const locations = Array.from(new Set(products.map((p) => p.locationTag)));

  const filteredProducts = products
    .filter((p) => p.status === 'active')
    .filter((p) => filters.category === 'all' || p.category === filters.category)
    .filter((p) => filters.location === 'all' || p.locationTag === filters.location)
    .filter((p) => !filters.fastOnly || p.isFastDelivery)
    .filter((p) => {
      const search = filters.query.trim().toLowerCase();
      if (!search) return true;
      return [p.name, p.description, p.vendorName, p.category].some((v) =>
        v?.toLowerCase().includes(search),
      );
    })
    .sort((a, b) => {
      const aScore = a.locationTag === user.address?.city ? 1 : 0;
      const bScore = b.locationTag === user.address?.city ? 1 : 0;
      return bScore - aScore;
    });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount  = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  async function syncCart(task, successMessage) {
    setCartLoading(true);
    try {
      const nextItems = await task;
      if (Array.isArray(nextItems)) {
        setCartItems(nextItems);
      }
      if (successMessage) {
        showToast({ title: successMessage, description: 'Your cart updated instantly.', variant: 'success' });
      }
    } catch (error) {
      showToast({
        title: 'Cart update failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setCartLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      await checkout(user.id);
      const refreshed = await getUserCart(user.id);
      setCartItems(refreshed);
      showToast({ title: 'Order placed', description: 'Routed to the right vendors.', variant: 'success' });
      setCartOpen(false);
    } catch (error) {
      showToast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-5 fade-in">
      <DashboardTopbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        title="Customer dashboard"
      />

      {/* Promotional Discount Ad Banner */}
      <div
        className="relative overflow-hidden rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:flex sm:items-center sm:justify-between shadow-sm"
      >
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-500">Flash Deal</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-indigo-950">50% Off Brand Partners</h2>
          <p className="mt-1 text-sm font-medium text-indigo-700 max-w-md">Get exclusive discounts from top local brands today. Apply code <strong>BRANDS50</strong> at checkout.</p>
        </div>
        <button className="relative z-10 mt-4 whitespace-nowrap rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 sm:mt-0">
          Claim Offer
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-hover-effect">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Express shopping</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-800">Curated items for your city</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-slate-100 text-slate-700" variant="neutral">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              Address: {user.address?.city}, {user.address?.state}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700" variant="neutral">
              <Clock3 className="mr-1 h-3.5 w-3.5" />
              Fastest ETA: 15 minutes
            </Badge>
          </div>
        </Card>

        <Card className="card-hover-effect">
          <p className="text-sm font-medium text-slate-500">Active cart total</p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-900">{formatCurrency(cartTotal)}</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-slate-50 border px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">15-min badge</p>
              <p className="mt-1 text-sm text-slate-600">Shown only on items flagged for express delivery.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location logic</p>
              <p className="mt-1 text-sm text-slate-600">Products matching {user.address?.city} float to the top.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Removed dark-theme-filters override */}
      <div>
        <ProductFilters filters={filters} locations={locations} onChange={setFilters} />
      </div>

      {isHydrating ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[420px] rounded-[28px] product-grid-item" style={{ animationDelay: `${index * 50}ms` }} />
          ))}
        </div>
      ) : filteredProducts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="relative product-grid-item" style={{ animationDelay: `${index * 50}ms` }}>
              {product.locationTag === user.address?.city && (
                /* MOVED BADGE: Absolute right-5 instead of left-5 prevents overlap. Added light theme styles. */
                <Badge className="absolute right-5 top-5 bg-orange-50 text-orange-600 border px-3 py-1 text-[10px] shadow-sm backdrop-blur-md" variant="warning">
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  Local pick-up
                </Badge>
              )}
              <ProductCard
                onAddToCart={(productId) => void syncCart(addItemToCart(user.id, productId), 'Added to cart')}
                product={product}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try broadening the search, disabling the fast-delivery filter, or switching the location selector."
          icon={Sparkles}
          title="No products matched your filters"
        />
      )}

      <CartSheet
        items={cartItems}
        loading={checkoutLoading || cartLoading}
        onCheckout={handleCheckout}
        onClose={() => setCartOpen(false)}
        onDecrement={(productId, quantity) => void syncCart(changeCartQuantity(user.id, productId, quantity - 1))}
        onIncrement={(productId, quantity) => void syncCart(changeCartQuantity(user.id, productId, quantity + 1))}
        onRemove={(productId) => void syncCart(deleteCartItem(user.id, productId), 'Item removed')}
        open={cartOpen}
      />
    </div>
  );
}