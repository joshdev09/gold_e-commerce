'use client';

import React from 'react';
import { GoldSpotData, CurrencyCode, WeightUnit, KaratPriceBreakdown } from '@/src/types/gold';
import { formatCurrency } from '@/src/lib/formatters';
import { GRAMS_PER_TROY_OUNCE, WEIGHT_UNITS } from '@/src/constants/gold-data';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface MarketOverviewProps {
  data: GoldSpotData;
  currency: CurrencyCode;
  selectedUnit: WeightUnit;
  tickDirection?: 'up' | 'down' | null;
  karats: KaratPriceBreakdown[];
  onOpenCalculator?: () => void;
}

export function MarketOverview({
  data,
  currency,
  selectedUnit,
  karats,
  onOpenCalculator,
}: MarketOverviewProps) {
  const currencyRate = data.rates[currency] ?? 1.0;
  const spotUSD = data.spotPriceOunceUSD;
  const spotInCurrency = spotUSD * currencyRate;
  
  const purePricePerGram = (spotInCurrency / GRAMS_PER_TROY_OUNCE) * 0.999;
  const unitInfo = WEIGHT_UNITS[selectedUnit];
  
  // 18K purity rate
  const k18 = karats.find((k) => k.karat === '18K');
  const k18Price = k18 ? k18.pricePerGram : purePricePerGram * 0.75;

  const isPositive = data.changePercent >= 0;

  const handleScrollToChart = () => {
    const el = document.getElementById('price-chart');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTable = () => {
    const el = document.getElementById('karat-table');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToInsights = () => {
    const el = document.getElementById('market-insights');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* 4 Clean Modern KPI Cards (Inspired by Fireart Studio Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* CARD 1: HERO ACCENT CARD (Deep Forest Green) */}
        <div className="bg-[#0f3d2e] dark:bg-[#092b20] text-white border border-[#1b5e47] dark:border-[#134937] rounded-2xl p-7 flex flex-col justify-between min-h-[195px] shadow-sm hover:shadow-md transition-all animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-header font-semibold text-emerald-100/90 tracking-wide">
              24K Pure Gold
            </span>
            <button
              type="button"
              onClick={onOpenCalculator}
              title="Open Valuation Desk"
              className="w-9 h-9 rounded-full bg-white text-[#0f3d2e] flex items-center justify-center hover:bg-emerald-50 hover:scale-105 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUpRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Metric Value */}
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-[42px] font-header font-extrabold text-white tracking-tight leading-none">
                {formatCurrency(purePricePerGram, currency)}
              </span>
              <span className="text-sm font-subtitle text-emerald-200/80 font-normal">
                / {unitInfo.symbol}
              </span>
            </div>
          </div>

          {/* Bottom Subtitle / Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs border border-white/20 font-subtitle">
              {isPositive ? (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-current shrink-0" aria-hidden="true">
                  <path d="M5 1L9.5 7.5H0.5L5 1Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-current shrink-0" aria-hidden="true">
                  <path d="M5 7L0.5 0.5H9.5L5 7Z" />
                </svg>
              )}
              <span>{Math.abs(data.changePercent).toFixed(2)}%</span>
            </span>
            <span className="text-xs text-emerald-100/80 font-subtitle font-medium">
              {isPositive ? 'Increased from yesterday' : 'Decreased from yesterday'}
            </span>
          </div>
        </div>

        {/* CARD 2: TROY OUNCE BENCHMARK (Clean White Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 flex flex-col justify-between min-h-[195px] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm animate-fade-in-up delay-75">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-header font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
              Troy Ounce (31.1g)
            </span>
            <button
              type="button"
              onClick={handleScrollToChart}
              title="View Historical Chart"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUpRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Metric Value */}
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-[42px] font-header font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                {formatCurrency(spotInCurrency, currency)}
              </span>
              <span className="text-sm font-subtitle text-slate-400 font-normal">
                / oz
              </span>
            </div>
          </div>

          {/* Bottom Subtitle / Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-subtitle">
              LBMA Spot
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-subtitle font-medium">
              Global Interbank Benchmark
            </span>
          </div>
        </div>

        {/* CARD 3: 18K JEWELRY GRADE (Clean White Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 flex flex-col justify-between min-h-[195px] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm animate-fade-in-up delay-150">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-header font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
              18K Jewelry Grade
            </span>
            <button
              type="button"
              onClick={handleScrollToTable}
              title="Compare Karat Matrix"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUpRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Metric Value */}
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl lg:text-[42px] font-header font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                {formatCurrency(k18Price, currency)}
              </span>
              <span className="text-sm font-subtitle text-slate-400 font-normal">
                / g
              </span>
            </div>
          </div>

          {/* Bottom Subtitle / Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-subtitle">
              75.0% Fine
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-subtitle font-medium">
              Most Popular Hallmark
            </span>
          </div>
        </div>

        {/* CARD 4: DEMAND INDEX (Clean White Card) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 flex flex-col justify-between min-h-[195px] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm animate-fade-in-up delay-225">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-header font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
              Demand Index
            </span>
            <button
              type="button"
              onClick={handleScrollToInsights}
              title="View Market Insights"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUpRightIcon className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Metric Value */}
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl lg:text-[42px] font-header font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                74
              </span>
              <span className="text-lg font-header font-bold text-slate-400">
                / 100
              </span>
            </div>
          </div>

          {/* Bottom Subtitle / Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-subtitle">
              Strong Buy
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-subtitle font-medium">
              Physical Accumulation
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
