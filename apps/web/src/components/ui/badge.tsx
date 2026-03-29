import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors',
  {
    variants: {
      variant: {
        success:
          'bg-semantic-success/10 text-semantic-success border border-semantic-success/20',
        warning:
          'bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20',
        danger:
          'bg-semantic-danger/10 text-semantic-danger border border-semantic-danger/20',
        neutral:
          'bg-white/[0.06] text-text-secondary border border-border-subtle',
        premium:
          'bg-accent-primary/10 text-accent-secondary border border-accent-primary/20',
        wine:
          'bg-accent-wine/10 text-accent-wine-light border border-accent-wine/20',
        info:
          'bg-semantic-info/10 text-semantic-info border border-semantic-info/20',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
