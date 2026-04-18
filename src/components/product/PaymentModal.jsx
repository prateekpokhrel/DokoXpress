import { Check, CreditCard, Laptop, Smartphone, Wallet, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';
import './PaymentModal.css';

export function PaymentModal({
  open,
  total,
  loading = false,
  onClose,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState('COD');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{ backgroundColor: 'rgba(236, 236, 236, 0.57)', backdropFilter: 'blur(12px)' }}
    >
      {/* Clickable Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[40px] border border-white/10 p-7 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ backgroundColor: '#ffffffff' }}
      >
        {/* Header (Fixed) */}
        <div className="mb-6 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1">
              Secure Checkout
            </p>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">Select Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
          {/* Amount Summary */}
          <div className="rounded-[24px] bg-white/5 border border-white/5 p-5 text-center">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total to Pay</p>
            <p className="text-3xl font-black text-white">{formatCurrency(total)}</p>
          </div>

          {/* Payment Methods */}
          <div className="grid gap-3">
            {[
              { id: 'COD', label: 'Cash on Delivery', icon: Wallet },
              { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'UPI', label: 'UPI / PhonePe', icon: Smartphone },
              { id: 'NET_BANKING', label: 'Net Banking', icon: Laptop },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-between rounded-[20px] border p-4 transition-all duration-300 ${paymentMethod === method.id
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${paymentMethod === method.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>
                    <method.icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm text-white">{method.label}</span>
                </div>
                {paymentMethod === method.id && <Check className="h-4 w-4 text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer (Fixed) */}
        <div className="mt-6 flex-shrink-0">
          <Button
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none py-6 rounded-[20px] shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.02] font-black text-base"
            fullWidth
            loading={loading}
            onClick={() => onConfirm(paymentMethod)}
            type="button"
          >
            Verify & Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
