'use client';

import React from 'react';
import { KaratPriceBreakdown, CurrencyCode, WeightUnit } from '@/src/types/gold';
import { formatCurrency } from '@/src/lib/formatters';
import { WEIGHT_UNITS } from '@/src/constants/gold-data';

interface KaratCardProps {
  data: KaratPriceBreakdown;
  currency: CurrencyCode;
  selectedUnit: WeightUnit;
  onSelectForCalculation: (karat: KaratPriceBreakdown['karat']) => void;
  isPopular?: boolean;
}

export function KaratCard({
  data,
  currency,
  selectedUnit,
  onSelectForCalculation,
  isPopular = false,
}: KaratCardProps) {
  const isPositive = data.changePercent24h >= 0;
  const unitInfo = WEIGHT_UNITS[selectedUnit];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
      <div>
        {/* Karat Header Badge & Purity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 text-sm font-header font-bold tracking-wider rounded-md bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-500/20">
              {data.karat}
            </span>
            <span className="text-sm font-subtitle font-medium text-slate-500 dark:text-slate-400">
              {data.fineness} / 1000
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPopular && (
              <span className="text-xs font-header font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                Popular
              </span>
            )}
            <span className="text-sm font-subtitle text-slate-400 font-medium">
              {(data.purity * 100).toFixed(1)}% Pure
            </span>
          </div>
        </div>

        {/* Primary Metric: Realtime Price per Gram */}
        <div className="my-4">
          <span className="text-xs font-subtitle uppercase text-slate-400 tracking-wider block font-semibold">
            Price Per Gram
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl sm:text-4xl font-bold font-header text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(data.pricePerGram, currency)}
            </span>
            <span className="text-sm font-subtitle text-slate-400 font-medium">
              / g
            </span>
          </div>
        </div>

        {/* Selected Unit Price (if not gram) */}
        {selectedUnit !== 'gram' && (
          <div className="my-3.5 py-2.5 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-subtitle">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Per {unitInfo.name}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(data.pricePerSelectedUnit, currency)} / {unitInfo.symbol}
            </span>
          </div>
        )}

        {/* Clean 2-column melt and retail metrics (NO distracting icons!) */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-subtitle block font-medium">
              Melt Buyback
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-base mt-1 block">
              {formatCurrency(data.buyRatePerGram, currency)}/g
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-subtitle block font-medium">
              Est. Retail
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-base mt-1 block">
              {formatCurrency(data.sellRatePerGram, currency)}/g
            </span>
          </div>
        </div>

        {/* Common Jewelry Usage Note */}
        <p className="text-sm text-slate-500 dark:text-slate-400 font-subtitle line-clamp-2 min-h-[40px] mt-2 leading-relaxed">
          {data.commonUse}
        </p>
      </div>

      {/* Card Footer: Clean Trend Triangle (No Pill) & Calculate Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 text-sm font-subtitle font-semibold ${
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {isPositive ? (
            <svg
              viewBox="0 0 10 8"
              className="w-2.5 h-2.5 fill-current shrink-0"
              aria-hidden="true"
            >
              <path d="M5 1L9.5 7.5H0.5L5 1Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 10 8"
              className="w-2.5 h-2.5 fill-current shrink-0"
              aria-hidden="true"
            >
              <path d="M5 7L0.5 0.5H9.5L5 7Z" />
            </svg>
          )}
          <span>{Math.abs(data.changePercent24h).toFixed(2)}%</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectForCalculation(data.karat)}
          className="text-sm font-subtitle font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          Calculate
        </button>
      </div>
    </div>
  );
}
