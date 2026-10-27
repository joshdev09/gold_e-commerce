'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20 py-12 transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-header font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wider">
                Gold Price Tracker
              </span>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm font-subtitle font-medium text-slate-500 dark:text-slate-400">
                Realtime Gold Market Desk
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl font-subtitle leading-relaxed">
              Spot bullion prices are sourced from interbank markets and LBMA fixes. Karat calculations assume standard legal fineness tolerances (24K: 99.9%, 22K: 91.67%, 18K: 75.0%, 14K: 58.33%).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-subtitle font-medium text-slate-500 dark:text-slate-400">
            <span>1 Troy Oz = 31.1035 Grams</span>
            <span>ISO 9202 Hallmarking Compliant</span>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs font-subtitle text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
          <span>Realtime Karat &amp; Gram Price System</span>
          <span>Flat Color Interface - Heroicons Strictly - Zero Emojis</span>
        </div>
      </div>
    </footer>
  );
}
