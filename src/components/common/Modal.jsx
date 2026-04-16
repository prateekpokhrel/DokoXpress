import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export function Modal({ open, title, description, children, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="surface-panel relative z-10 w-full max-w-3xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
