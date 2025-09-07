import React from 'react';
import { cn, getStatusColor } from '../../utils/helpers';

export function Badge({ children, status, className }) {
  return (
    <span className={cn("status-badge", getStatusColor(status), className)}>
      {children}
    </span>
  );
}