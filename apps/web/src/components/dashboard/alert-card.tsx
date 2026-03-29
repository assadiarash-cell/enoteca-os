import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

type Priority = 'critical' | 'high' | 'medium' | 'low';

interface AlertCardProps {
  title: string;
  message: string;
  priority: Priority;
  timestamp: string;
  actions?: { label: string; onClick?: () => void }[];
  className?: string;
}

const priorityConfig: Record<
  Priority,
  { icon: typeof AlertTriangle; className: string }
> = {
  critical: { icon: AlertCircle, className: 'priority-critical' },
  high: { icon: AlertTriangle, className: 'priority-high' },
  medium: { icon: Info, className: 'priority-medium' },
  low: { icon: CheckCircle, className: 'priority-low' },
};

export function AlertCard({
  title,
  message,
  priority,
  timestamp,
  actions,
  className,
}: AlertCardProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-md border border-border-subtle bg-bg-secondary p-4',
        config.className,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-text-secondary" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-body-sm font-medium text-text-primary">
              {title}
            </h4>
            <span className="text-caption text-text-tertiary whitespace-nowrap">
              {timestamp}
            </span>
          </div>
          <p className="text-body-sm text-text-secondary">{message}</p>
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-1">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
