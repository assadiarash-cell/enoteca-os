import { cn } from '@/lib/utils';

type AgentStatus = 'active' | 'idle' | 'error' | 'disabled';

interface AgentCardProps {
  name: string;
  description: string;
  status: AgentStatus;
  lastRun?: string;
  tasksCompleted?: number;
  className?: string;
}

const statusConfig: Record<
  AgentStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  active: {
    label: 'Attivo',
    dotColor: 'bg-semantic-success',
    textColor: 'text-semantic-success',
  },
  idle: {
    label: 'In attesa',
    dotColor: 'bg-semantic-warning',
    textColor: 'text-semantic-warning',
  },
  error: {
    label: 'Errore',
    dotColor: 'bg-semantic-danger',
    textColor: 'text-semantic-danger',
  },
  disabled: {
    label: 'Disabilitato',
    dotColor: 'bg-text-disabled',
    textColor: 'text-text-disabled',
  },
};

export function AgentCard({
  name,
  description,
  status,
  lastRun,
  tasksCompleted,
  className,
}: AgentCardProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-secondary p-4 hover-lift',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-body-sm font-medium text-text-primary">{name}</h4>
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              config.dotColor,
              status === 'active' && 'animate-pulse'
            )}
          />
          <span className={cn('text-caption', config.textColor)}>
            {config.label}
          </span>
        </div>
      </div>

      <p className="text-caption text-text-secondary line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between text-caption text-text-tertiary border-t border-border-subtle pt-3">
        {lastRun && <span>Ultimo run: {lastRun}</span>}
        {tasksCompleted !== undefined && (
          <span>{tasksCompleted} task completati</span>
        )}
      </div>
    </div>
  );
}
