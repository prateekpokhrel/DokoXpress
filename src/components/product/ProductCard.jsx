import { Clock3, MapPin, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import './ProductCard.css';

export function ProductCard({ 
  product, 
  cartQuantity = 0, // NEW: Defaults to 0 if not provided
  onAddToCart, 
  onIncrement,      // NEW: Function to handle +
  onDecrement       // NEW: Function to handle -
}) {
  return (
    // FIX 1: Added `h-full` so every card stretches to the height of the tallest card in the row
    <div className="product-card-glow group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0e] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-[#0f0f13]">
      
      {/* ================= IMAGE & BADGES ================= */}
      {/* FIX 2: Added `shrink-0` to ensure the image container doesn't get squished by flexbox */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        {/* Cinematic Zoom on Hover */}
        <img 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={product.image} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80" />
        
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {/* FIX 3: Added `whitespace-nowrap` to prevent text from wrapping and breaking the pill shape */}
          <span className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
            {product.category}
          </span>
          {product.isFastDelivery ? (
            <span className="whitespace-nowrap rounded-full border border-orange-400/50 bg-orange-500/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] backdrop-blur-md">
              ⚡ 15-min
            </span>
          ) : null}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* FIX 4: Added `line-clamp-1` so long titles truncate cleanly instead of pushing content down */}
            <h3 className="line-clamp-1 font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-orange-400">
              {product.name}
            </h3>
            {/* FIX 5: Added `min-h-[2.75rem]` to force the description to always occupy exactly 2 lines of vertical space */}
            <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-relaxed text-white/50">
              {product.description}
            </p>
          </div>
          {/* FIX 6: Added `shrink-0` to the price so it never gets squeezed by a long product name */}
          <p className="shrink-0 text-2xl font-black text-white drop-shadow-md">
            {formatCurrency(product.price)}
          </p>
        </div>

        {/* FIX 7: This empty invisible div eats up all remaining vertical space, pushing the footer to the absolute bottom */}
        <div className="flex-1"></div>

        {/* ================= METADATA PILLS ================= */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/70">
          <span className="flex whitespace-nowrap items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/10">
            <MapPin className="h-3.5 w-3.5 text-orange-400" />
            {product.locationTag}
          </span>
          <span className="flex whitespace-nowrap items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/10">
            <Clock3 className="h-3.5 w-3.5 text-teal-400" />
            {product.deliveryMinutes} min
          </span>
          <span className="flex whitespace-nowrap items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-white/50 backdrop-blur-sm transition-colors hover:bg-white/10">
            By {product.vendorName}
          </span>
        </div>

        {/* ================= FOOTER / ADD TO CART ================= */}
        <div className="mt-5 flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 5 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              {product.stock > 0 ? `${product.stock} Left` : 'Out of stock'}
            </p>
          </div>
          
          {/* DYNAMIC CART CONTROLS */}
          {cartQuantity > 0 ? (
            /* Selected State: The [ - ] 1 [ + ] Pill */
            <div className="flex h-[40px] items-center gap-2 rounded-[16px] bg-gradient-to-r from-orange-500 to-orange-400 p-1 shadow-[0_0_15px_rgba(249,115,22,0.25)]">
              <button 
                onClick={() => onDecrement(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-black/20 text-white transition-colors hover:bg-black/40 font-bold"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="w-5 text-center text-sm font-black text-white">
                {cartQuantity}
              </span>
              
              <button 
                onClick={() => onIncrement(product.id)}
                disabled={product.stock <= cartQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-black/20 text-white transition-colors hover:bg-black/40 font-bold disabled:opacity-40 disabled:hover:bg-black/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : onAddToCart ? (
            /* Default State: The Add Button */
            <Button 
              onClick={() => onAddToCart(product.id)} 
              disabled={product.stock === 0}
              className="relative overflow-hidden rounded-[16px] border border-white/10 bg-white/10 px-5 py-2 font-bold text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:border-white/10 disabled:bg-white/10 disabled:opacity-50" 
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