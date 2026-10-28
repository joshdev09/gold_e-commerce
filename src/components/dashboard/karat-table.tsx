'use client';

import React, { useState } from 'react';
import { KaratPriceBreakdown, CurrencyCode, KaratType } from '@/src/types/gold';
import { formatCurrency } from '@/src/lib/formatters';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface KaratTableProps {
  karats: KaratPriceBreakdown[];
  currency: CurrencyCode;
  tickDirection?: 'up' | 'down' | null;
  onSelectForCalculation: (karat: KaratType) => void;
}

export function KaratTable({
  karats,
  currency,
  tickDirection,
  onSelectForCalculation,
}: KaratTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredKarats = karats.filter(
    (k) =>
      k.karat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.fineness.toString().includes(searchTerm) ||
      k.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyRates = () => {
    const textLines = [
      `Gold Price Comparison Matrix (${currency})`,
      `Date: ${new Date().toLocaleString()}`,
      `----------------------------------------`,
      ...karats.map(
        (k) =>
          `${k.karat} (${k.fineness} - ${(k.purity * 100).toFixed(1)}%): ` +
          `1g: ${formatCurrency(k.pricePerGram, currency)} | ` +
          `5g: ${formatCurrency(k.price5g, currency)} | ` +
          `10g: ${formatCurrency(k.price10g, currency)} | ` +
          `1 oz: ${formatCurrency(k.priceOunce, currency)}`
      ),
    ].join('\n');

    navigator.clipboard.writeText(textLines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm transition-colors space-y-6 w-full animate-fade-in-up delay-100">
      
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-header tracking-tight text-slate-900 dark:text-white uppercase">
            Karat &amp; Gram Price Comparison Matrix
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-subtitle">
            Realtime pricing comparison across all gold purities and standard weights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search karat or hallmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm font-subtitle bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 w-52 sm:w-60 transition-colors"
            />
          </div>

          {/* Copy Table Rates */}
          <button
            type="button"
            onClick={handleCopyRates}
            className="px-4 py-2.5 text-sm font-medium font-subtitle bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Copy all rates to clipboard"
          >
            {copied ? 'Copied' : 'Copy Rates'}
          </button>
        </div>
      </div>

      {/* Clean Table: Occupies the full container space, generous padding, NO horizontal scrollbar */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left font-subtitle text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="py-4 px-6 font-header">Karat &amp; Fineness</th>
              <th className="py-4 px-6 font-header">Pure Gold</th>
              <th className="py-4 px-6 font-header font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30">
                Price / Gram
              </th>
              <th className="py-4 px-6 font-header">24H Trend</th>
              <th className="py-4 px-6 font-header">5 Grams</th>
              <th className="py-4 px-6 font-header">10 Grams</th>
              <th className="py-4 px-6 font-header">Troy Ounce (31.1g)</th>
              <th className="py-4 px-6 text-center font-header">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredKarats.map((k) => {
              const isPositive = k.changePercent24h >= 0;
              return (
                <tr
                  key={k.karat}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Karat Badge & Hallmark */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 font-bold text-sm rounded-md bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-500/20 font-header">
                        {k.karat}
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                          {k.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Hallmark: {k.fineness}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Purity % */}
                  <td className="py-4.5 px-6 text-slate-700 dark:text-slate-300 font-medium">
                    {(k.purity * 100).toFixed(1)}%
                  </td>

                  {/* Price Per Gram (Primary Highlight with Live Tick Animation) */}
                  <td
                    className={`py-4.5 px-6 font-bold text-base transition-colors duration-500 bg-amber-50/40 dark:bg-amber-950/20 ${
                      tickDirection === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                        : tickDirection === 'down'
                        ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {formatCurrency(k.pricePerGram, currency)}
                  </td>

                  {/* 24H Trend: Up [ green ] or Down [ red ] triangle - No pill */}
                  <td className="py-4.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold text-sm ${
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
                      <span>{Math.abs(k.changePercent24h).toFixed(2)}%</span>
                    </span>
                  </td>

                  {/* 5 Grams */}
                  <td className="py-4.5 px-6 text-slate-800 dark:text-slate-200 font-medium">
                    {formatCurrency(k.price5g, currency)}
                  </td>

                  {/* 10 Grams */}
                  <td className="py-4.5 px-6 text-slate-800 dark:text-slate-200 font-medium">
                    {formatCurrency(k.price10g, currency)}
                  </td>

                  {/* Troy Ounce */}
                  <td className="py-4.5 px-6 text-slate-800 dark:text-slate-200 font-medium">
                    {formatCurrency(k.priceOunce, currency)}
                  </td>

                  {/* Action */}
                  <td className="py-4.5 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectForCalculation(k.karat)}
                      className="text-xs font-subtitle font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 transition-colors cursor-pointer"
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
