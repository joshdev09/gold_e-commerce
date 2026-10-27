'use client';

import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface AnimatedThemeTogglerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  duration?: number;
}

export function AnimatedThemeToggler({
  className = '',
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof window === 'undefined') return;

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const nextDark = !isDark;

    const applyTheme = () => {
      setIsDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    const hasViewTransition = 'startViewTransition' in document;
    if (!hasViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme();
      return;
    }

    const doc = document as unknown as {
      startViewTransition: (cb: () => void) => { ready: Promise<void> };
    };

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        applyTheme();
      });
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer ${className}`}
      {...props}
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 text-amber-400" />
      ) : (
        <MoonIcon className="h-4 w-4 text-slate-600" />
      )}
    </button>
  );
}
