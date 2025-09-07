import React from 'react';
import { cn } from '../../utils/helpers';

export default function LoadingSpinner({ className, size = 'default' }) {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={cn("animate-spin rounded-full border-4 border-gray-200 border-t-primary-600", sizes[size], className)} />
    </div>
  );
}