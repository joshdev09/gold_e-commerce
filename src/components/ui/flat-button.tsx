import React from 'react';

interface FlatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function FlatButton({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: FlatButtonProps) {
  const variantStyles = {
    primary:
      'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 border border-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
    secondary:
      'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900 border border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800',
    danger:
      'bg-rose-600 text-white border border-rose-600 hover:bg-rose-700 active:bg-rose-800',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-3.5 py-2 gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
