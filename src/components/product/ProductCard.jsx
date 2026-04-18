import { Clock3, MapPin, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import './ProductCard.css';

/**
 * Utility: Calculate distance between 2 coordinates (Haversine Formula)
 */
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ProductCard({
  product,
  userLocation,
  cartQuantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement
}) {

  /* ================= SAFE CITY MATCH ================= */
  const userCity = userLocation?.city?.trim().toLowerCase();
  const productCity = product.locationTag?.trim().toLowerCase();

  const isSameCity = userCity && productCity && userCity === productCity;

  /* ================= SAFE DISTANCE ================= */
  let isWithinRadius = false;

  if (
    userLocation?.lat &&
    userLocation?.lng &&
    product.vendorLat &&
    product.vendorLng
  ) {
    const distance = getDistanceInKm(
      userLocation.lat,
      userLocation.lng,
      product.vendorLat,
      product.vendorLng
    );

    isWithinRadius = distance <= 3;
  }

  /* ================= FINAL DELIVERY LOGIC ================= */
  const showFastDelivery =
    product.isFastDelivery &&
    (
      isSameCity ||         // city match
      isWithinRadius ||     // OR nearby
      !product.vendorLat    // OR fallback if no coords
    );

  /* ================= RENDER ================= */
  return (
    <div className="product-card-glow group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20">

      {/* ================= IMAGE ================= */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img
          alt={product.name}
          src={product.image}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{
            imageRendering: 'auto',
            backfaceVisibility: 'hidden'
          }}
        />

        <div className="image-overlay"></div>

        {/* ================= BADGES ================= */}
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <span className="badge">
            {product.category}
          </span>

          {showFastDelivery && (
            <span className="badge badge-fast">
              ⚡ 15 min
            </span>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-1 flex-col p-6">

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-xl font-bold text-white transition-colors group-hover:text-orange-400">
              {product.name}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm text-white/60">
              {product.description}
            </p>
          </div>

          <p className="shrink-0 text-2xl font-black text-white">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="flex-1"></div>

        {/* ================= META ================= */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">

          <span className="pill flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-orange-500" />
            {product.locationTag}
          </span>

          <span className="pill flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-teal-500" />
            {
              showFastDelivery
                ? '⚡ 15 min'
                : isSameCity
                  ? 'Local Pick-up'
                  : 'Scheduled'
            }
          </span>

          <span className="pill text-gray-700">
            By {product.vendorName}
          </span>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-5 flex items-center justify-between pt-2">

          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 5 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            <p className="text-xs font-bold text-white/50">
              {product.stock > 0 ? `${product.stock} Left` : 'Out of stock'}
            </p>
          </div>

          {/* ================= CART ================= */}
          {cartQuantity > 0 ? (
            <div className="flex h-[40px] items-center gap-2 rounded-[16px] bg-orange-500 p-1">
              <button
                onClick={() => onDecrement(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-black/20 text-white"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-5 text-center text-sm font-bold text-white">
                {cartQuantity}
              </span>

              <button
                onClick={() => onIncrement(product.id)}
                disabled={product.stock <= cartQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-black/20 text-white disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : onAddToCart ? (
            <Button
              onClick={() => onAddToCart(product.id)}
              disabled={product.stock === 0}
              className="rounded-[16px] px-6 py-2.5 font-bold text-white bg-orange-500 hover:scale-105 active:scale-95 disabled:opacity-40"
              type="button"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}