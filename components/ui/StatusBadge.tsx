import React from 'react';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ComponentType<{ size: number }>;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant,
  icon: Icon,
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full';
  
  const variantClasses = {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    info: 'status-info',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </span>
  );
};