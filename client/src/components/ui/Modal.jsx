import React, { useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { X } from 'lucide-react';
import Button from './Button';

export function Modal({ isOpen, onClose, children, className }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
        className
      )}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ className, children, onClose }) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700", className)}>
      <div>{children}</div>
      {onClose && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function ModalContent({ className, children }) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children }) {
  return (
    <div className={cn("flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
}