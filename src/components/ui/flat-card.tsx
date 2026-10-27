import React from 'react';

interface FlatCardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export function FlatCard({
  children,
  className = '',
  header,
  footer,
  hoverable = false,
}: FlatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors ${
        hoverable ? 'hover:border-slate-400 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      {header && (
        <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 bg-slate-50/60 dark:bg-slate-900/80">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3 bg-slate-50/40 dark:bg-slate-900/40">
          {footer}
        </div>
      )}
    </div>
  );
}
