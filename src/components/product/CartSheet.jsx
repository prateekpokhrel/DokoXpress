import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import './CartSheet.css';

export function CartSheet({
  open,
  items,
  loading = false,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}) {
  if (!open) return null;

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm cart-overlay">
      {/* Clickable Backdrop */}
      <button 
        aria-label="Close cart" 
        className="absolute inset-0 h-full w-full cursor-default" 
        onClick={onClose} 
        type="button" 
      />
      
      {/* Side Panel */}
      <aside className="relative h-full w-full max-w-lg border-l border-white/10 bg-[#0a0a0e] px-6 py-8 shadow-2xl cart-panel flex flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1">
              Your Selection
            </p>
            <h3 className="font-display text-3xl font-bold text-white tracking-tight">Your basket</h3>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {items.length ? (
            items.map((item) => (
              <div key={item.productId} className="rounded-[24px] border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                <div className="flex gap-4">
                  <img 
                    alt={item.product.name} 
                    className="h-20 w-20 rounded-[18px] object-cover border border-white/10 shadow-sm" 
                    src={item.product.image} 
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-white tracking-wide">{item.product.name}</p>
                        <p className="mt-1 text-xs font-medium text-white/40">{item.product.vendorName}</p>
                      </div>
                      <button 
                        className="text-white/20 transition-colors hover:text-red-500" 
                        onClick={() => onRemove(item.productId)} 
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full bg-black/40 border border-white/10 p-1 shadow-inner">
                        <button 
                          className="rounded-full bg-white/5 p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white" 
                          onClick={() => onDecrement(item.productId, item.quantity)} 
                          type="button"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button 
                          className="rounded-full bg-white/5 p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white" 
                          onClick={() => onIncrement(item.productId, item.quantity)} 
                          type="button"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-lg font-bold text-white">{formatCurrency(item.subtotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 px-8 py-16 text-center">
              <div className="rounded-full bg-white/5 p-5 mb-4">
                <ShoppingBag className="h-10 w-10 text-white/20" />
              </div>
              <p className="font-bold text-white text-lg">Your cart is empty</p>
              <p className="mt-2 text-sm text-white/40 max-w-[240px]">Add products from trusted vendors to start your journey.</p>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Grand Total</span>
            <span className="font-display text-3xl font-black text-white drop-shadow-md">{formatCurrency(total)}</span>
          </div>
          <Button
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none py-7 rounded-[20px] shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] font-bold text-lg"
            disabled={!items.length}
            fullWidth
            loading={loading}
            onClick={onCheckout}
            type="button"
          >
            Place order now
          </Button>
        </div>
      </aside>
    </div>
  );
}