import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateId(prefix) {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getBatteryLevel(battery) {
  if (battery >= 60) return 'high';
  if (battery >= 30) return 'medium';
  return 'low';
}

export function getStatusColor(status) {
  const statusColors = {
    available: 'status-available',
    'in-transit': 'status-in-transit',
    charging: 'status-charging',
    pending: 'status-pending',
    approved: 'status-approved',
    assigned: 'status-assigned',
    delivered: 'status-delivered'
  };
  
  return statusColors[status] || 'status-pending';
}