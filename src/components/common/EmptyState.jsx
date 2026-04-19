import { Card } from './Card';
import { Button } from './Button';
import './EmptyState.css';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Card className="flex flex-col items-center justify-center px-8 py-16 text-center border-dashed">

      {/* SAFE ICON RENDER */}
      {Icon && (
        <div className="mb-6 rounded-3xl bg-white/5 border border-white/10 p-5 text-orange-500 shadow-inner">
          <Icon className="h-10 w-10" />
        </div>
      )}

      <h3 className="font-display text-2xl font-bold text-white">
        {title || "No Data"}
      </h3>

      {description && (
        <p className="mt-3 max-w-sm text-sm font-medium text-white/40 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button className="mt-8" onClick={onAction} type="button" variant="secondary">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}