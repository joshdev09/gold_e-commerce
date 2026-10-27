'use client';

import React, { useState } from 'react';
import { CurrencyCode, WeightUnit } from '@/src/types/gold';
import { CURRENCY_INFO, WEIGHT_UNITS } from '@/src/constants/gold-data';
import {
  ArrowPathIcon,
  ClockIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { FlatButton } from '@/src/components/ui/flat-button';
import { AnimatedThemeToggler } from '@/registry/magicui/animated-theme-toggler';

interface HeaderProps {
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  selectedUnit: WeightUnit;
  onUnitChange: (unit: WeightUnit) => void;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  countdown?: number;
  lastUpdated?: number;
}

export function Header({
  selectedCurrency,
  onCurrencyChange,
  selectedUnit,
  onUnitChange,
  refreshInterval,
  onRefreshIntervalChange,
  isRefreshing,
  onRefresh,
}: HeaderProps) {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState<boolean>(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false);
  const [intervalDropdownOpen, setIntervalDropdownOpen] = useState<boolean>(false);

  const intervals = [
    { label: 'Live (5s)', value: 5000 },
    { label: '10s Interval', value: 10000 },
    { label: '30s Interval', value: 30000 },
    { label: '60s Interval', value: 60000 },
    { label: 'Manual Refresh', value: 0 },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 transition-colors shadow-xs">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Title */}
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-header">
              Gold Price Tracker
            </span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setUnitDropdownOpen(false);
                  setIntervalDropdownOpen(false);
                }}
                className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <CurrencyDollarIcon className="w-4 h-4 text-slate-500" />
                <span>{selectedCurrency} ({CURRENCY_INFO[selectedCurrency].symbol})</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
                  <div className="px-4 py-1.5 text-xs uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 font-subtitle">
                    Select Currency
                  </div>
                  {Object.values(CURRENCY_INFO).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onCurrencyChange(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-subtitle ${
                        selectedCurrency === c.code
                          ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{c.code} - {c.name}</span>
                      {selectedCurrency === c.code && <CheckIcon className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weight Unit Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUnitDropdownOpen(!unitDropdownOpen);
                  setCurrencyDropdownOpen(false);
                  setIntervalDropdownOpen(false);
                }}
                className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <ScaleIcon className="w-4 h-4 text-slate-500" />
                <span>{WEIGHT_UNITS[selectedUnit].name} ({WEIGHT_UNITS[selectedUnit].symbol})</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>

              {unitDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
                  <div className="px-4 py-1.5 text-xs uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 font-subtitle">
                    Weight Unit
                  </div>
                  {Object.values(WEIGHT_UNITS).map((u) => (
                    <button
                      key={u.unit}
                      onClick={() => {
                        onUnitChange(u.unit);
                        setUnitDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-subtitle ${
                        selectedUnit === u.unit
                          ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{u.name} ({u.symbol})</span>
                      {selectedUnit === u.unit && <CheckIcon className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Interval Selector */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => {
                  setIntervalDropdownOpen(!intervalDropdownOpen);
                  setCurrencyDropdownOpen(false);
                  setUnitDropdownOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ClockIcon className="w-4 h-4 text-slate-400" />
                <span className="font-subtitle">
                  {intervals.find((i) => i.value === refreshInterval)?.label || '10s Interval'}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>

              {intervalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
                  {intervals.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        onRefreshIntervalChange(item.value);
                        setIntervalDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-subtitle ${
                        refreshInterval === item.value
                          ? 'font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{item.label}</span>
                      {refreshInterval === item.value && <CheckIcon className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Instant Refresh Button */}
            <FlatButton
              variant="outline"
              size="md"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh gold prices"
              className="rounded-lg font-subtitle text-sm"
              icon={
                <ArrowPathIcon
                  className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${
                    isRefreshing ? 'animate-spin text-amber-600' : ''
                  }`}
                />
              }
            >
              <span className="hidden sm:inline">Refresh</span>
            </FlatButton>

            {/* MagicUI Animated Theme Toggler */}
            <AnimatedThemeToggler />
          </div>

        </div>
      </div>
    </header>
  );
}
