import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-violet-600 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  outline: 'text-gray-700 border border-gray-200',
};

const Badge = forwardRef(({
  className,
  variant = 'default',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants }; 