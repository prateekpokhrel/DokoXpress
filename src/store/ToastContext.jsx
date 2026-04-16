import { createContext, useContext, useState } from 'react';
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import './ToastContext.css';

const ToastContext = createContext(null);

const variantStyles = {
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
  },
  error: {
    icon: XCircle,
    classes: 'border-rose-200 bg-rose-50/90 text-rose-900',
  },
  info: {
    icon: Info,
    classes: 'border-sky-200 bg-sky-50/90 text-sky-900',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'border-amber-200 bg-amber-50/90 text-amber-900',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  return (
    <ToastContext.Provider
      value={{
        showToast(toast) {
          const id = Math.random().toString(36).slice(2, 8);
          setToasts((current) => [...current, { ...toast, id }]);
          window.setTimeout(() => {
            setToasts((current) => current.filter((item) => item.id !== id));
          }, 3200);
        },
      }}
    >
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const styles = variantStyles[toast.variant];
          const Icon = styles.icon;

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto rounded-2xl border px-4 py-3 shadow-soft backdrop-blur-sm transition',
                styles.classes,
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}
