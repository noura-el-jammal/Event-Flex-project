import { forwardRef } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-violet-600 text-white hover:bg-violet-700',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  ghost: 'hover:bg-gray-100 text-gray-700',
  link: 'text-violet-600 underline-offset-4 hover:underline',
};

const sizeVariants = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

const Button = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants }; 