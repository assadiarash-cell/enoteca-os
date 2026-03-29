import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type BottleStatus = 'listed' | 'acquired' | 'pending' | 'sold';

interface BottleCardProps {
  name: string;
  vintage?: string;
  category: string;
  region?: string;
  price: number;
  margin?: number;
  status: BottleStatus;
  imageUrl?: string;
  className?: string;
}

const statusBadge: Record<BottleStatus, { label: string; variant: 'success' | 'warning' | 'neutral' | 'premium' }> = {
  listed: { label: 'Listed', variant: 'premium' },
  acquired: { label: 'Acquired', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  sold: { label: 'Sold', variant: 'neutral' },
};

export function BottleCard({
  name,
  vintage,
  category,
  region,
  price,
  margin,
  status,
  imageUrl,
  className,
}: BottleCardProps) {
  const badge = statusBadge[status];

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-md border border-border-subtle bg-bg-secondary p-4 transition-all duration-200 hover:border-border-medium hover:bg-bg-tertiary cursor-pointer',
        className
      )}
    >
      {/* Bottle image */}
      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-bg-tertiary overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-10 w-3 rounded-sm bg-accent-wine/30" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-body-sm font-medium text-text-primary truncate">
            {name}
          </h4>
          {vintage && (
            <span className="text-caption text-text-tertiary shrink-0">
              {vintage}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-caption text-text-secondary">
          <span>{category}</span>
          {region && (
            <>
              <span className="text-text-disabled">·</span>
              <span>{region}</span>
            </>
          )}
        </div>
      </div>

      {/* Price & margin */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-body-sm font-medium text-text-primary">
          {formatCurrency(price)}
        </span>
        {margin !== undefined && (
          <span
            className={cn(
              'text-caption',
              margin >= 0 ? 'text-semantic-success' : 'text-semantic-danger'
            )}
          >
            {margin >= 0 ? '+' : ''}{margin}%
          </span>
        )}
      </div>

      {/* Status */}
      <Badge variant={badge.variant} className="shrink-0">
        {badge.label}
      </Badge>
    </div>
  );
}
