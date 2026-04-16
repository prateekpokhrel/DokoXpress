import { cn } from '@/utils/cn';
import './Card.css';

export function Card({ children, className, ...props }) {
  return (
    <div className={cn('premium-card p-6', className)} {...props}>
      {children}
    </div>
  );
}