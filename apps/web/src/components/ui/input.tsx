import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-caption text-text-secondary uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            'flex h-10 w-full rounded-md border bg-bg-tertiary px-3 py-2 text-body-sm text-text-primary',
            'placeholder:text-text-disabled',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:border-accent-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            error
              ? 'border-semantic-danger/50'
              : 'border-border-medium hover:border-border-strong',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-caption text-semantic-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
