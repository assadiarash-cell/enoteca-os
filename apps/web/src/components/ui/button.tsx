import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-body-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-copper-gradient text-white shadow-sm hover:brightness-110 active:brightness-95',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]',
        danger:
          'bg-semantic-danger/10 text-semantic-danger hover:bg-semantic-danger/20 border border-semantic-danger/20',
        success:
          'bg-semantic-success/10 text-semantic-success hover:bg-semantic-success/20 border border-semantic-success/20',
        outline:
          'border border-border-medium text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-white/[0.04]',
        wine:
          'bg-wine-gradient text-white shadow-sm hover:brightness-110 active:brightness-95',
      },
      size: {
        sm: 'h-8 px-3 text-caption',
        md: 'h-10 px-4 text-body-sm',
        lg: 'h-12 px-6 text-body-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
