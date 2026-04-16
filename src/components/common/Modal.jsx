import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export function Modal({ open, title, description, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-3xl rounded-[24px] border p-8 shadow-xl overflow-y-auto max-h-[90vh]"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-6 flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>{title}</h2>
            {description && <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>}
          </div>
          <button
            className="rounded-full border p-2 transition-colors hover:bg-slate-100"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
