import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DealCardProps {
  title: string;
  sellerOrBuyer: string;
  bottleCount: number;
  value: number;
  type: 'acquisition' | 'sale';
  daysInStage: number;
  className?: string;
}

export function DealCard({
  title,
  sellerOrBuyer,
  bottleCount,
  value,
  type,
  daysInStage,
  className,
}: DealCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-secondary p-4 hover-lift cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-body-sm font-medium text-text-primary line-clamp-2">
          {title}
        </h4>
        <Badge variant={type === 'acquisition' ? 'wine' : 'premium'}>
          {type === 'acquisition' ? 'Acquisto' : 'Vendita'}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-caption">
          <span className="text-text-secondary">{sellerOrBuyer}</span>
          <span className="text-text-tertiary">
            {bottleCount} {bottleCount === 1 ? 'bottiglia' : 'bottiglie'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-medium text-accent-secondary">
            {formatCurrency(value)}
          </span>
          <span className="text-caption text-text-tertiary">
            {daysInStage}g in fase
          </span>
        </div>
      </div>
    </div>
  );
}
