import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  status?: ApplicationStatus;
}

export function Badge({ children, variant = 'default', status, className, ...props }: BadgeProps) {
  // If status is provided, use it to determine variant
  const effectiveVariant = status
    ? status === 'approved'
      ? 'success'
      : status === 'rejected'
      ? 'error'
      : 'warning'
    : variant;

  const variants = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[effectiveVariant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
