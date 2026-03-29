import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  className?: string;
}

export function KpiCard({ label, value, delta, icon: Icon, className }: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-secondary p-5 hover-lift',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-overline uppercase text-text-tertiary">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary/10">
          <Icon className="h-4 w-4 text-accent-primary" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-title-1 text-text-primary">{value}</span>
        {delta !== undefined && (
          <span
            className={cn(
              'text-caption font-medium mb-1',
              isPositive ? 'text-semantic-success' : 'text-semantic-danger'
            )}
          >
            {isPositive ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
