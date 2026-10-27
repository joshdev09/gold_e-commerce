'use client';

import React, { useState } from 'react';
import { KaratPriceBreakdown, CurrencyCode, WeightUnit, KaratType } from '@/src/types/gold';
import { KaratCard } from '@/src/components/dashboard/karat-card';

interface KaratGridProps {
  karats: KaratPriceBreakdown[];
  currency: CurrencyCode;
  selectedUnit: WeightUnit;
  onSelectForCalculation: (karat: KaratType) => void;
}

export function KaratGrid({
  karats,
  currency,
  selectedUnit,
  onSelectForCalculation,
}: KaratGridProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'high_karat' | 'jewelry'>('all');

  const filteredKarats = karats.filter((k) => {
    if (filterMode === 'high_karat') {
      return ['24K', '22K', '21K'].includes(k.karat);
    }
    if (filterMode === 'jewelry') {
      return ['22K', '18K', '14K', '10K'].includes(k.karat);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Clean Section Header (No unnecessary icon!) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-header tracking-tight text-slate-900 dark:text-white uppercase">
            Realtime Karat Rates (Per Gram)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-subtitle">
            Live physical gold prices derived from spot bullion benchmarks and precise purity ratios.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer font-subtitle ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Karats ({karats.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('high_karat')}
            className={`px-3.5 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer font-subtitle ${
              filterMode === 'high_karat'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bullion (21K-24K)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('jewelry')}
            className={`px-3.5 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer font-subtitle ${
              filterMode === 'jewelry'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Jewelry Grades
          </button>
        </div>
      </div>

      {/* Grid of Karat Cards with Breathable Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredKarats.map((k) => (
          <KaratCard
            key={k.karat}
            data={k}
            currency={currency}
            selectedUnit={selectedUnit}
            onSelectForCalculation={onSelectForCalculation}
            isPopular={k.karat === '24K' || k.karat === '18K' || k.karat === '22K'}
          />
        ))}
      </div>
    </div>
  );
}
