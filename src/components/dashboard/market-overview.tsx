'use client';

import React from 'react';
import { GoldSpotData, CurrencyCode, WeightUnit, KaratPriceBreakdown } from '@/src/types/gold';
import { formatCurrency } from '@/src/lib/formatters';
import { GRAMS_PER_TROY_OUNCE, WEIGHT_UNITS } from '@/src/constants/gold-data';
import {
  ChevronRightIcon,
  ShieldCheckIcon,
  ScaleIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

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
  
  const bidInCurrency = data.bidPriceOunceUSD * currencyRate;
  const askInCurrency = data.askPriceOunceUSD * currencyRate;
  const spreadOunce = askInCurrency - bidInCurrency;
  const spreadPerGram = spreadOunce / GRAMS_PER_TROY_OUNCE;

  const highInCurrency = data.dayHighOunceUSD * currencyRate;
  const lowInCurrency = data.dayLowOunceUSD * currencyRate;

  const isPositive = data.changePercent >= 0;

  // Sentiment score (0-100 gauge like Fear & Greed in CoinMarketCap)
  const sentimentScore = 74; // Bullion Accumulation Index

  // Top 4 trending karats
  const topTrending = karats.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* 4 Overview Terminal Cards (CoinMarketCap Inspo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: MARKET STATUS & SENTIMENT GAUGE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-header font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                Market Status
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                Bullish Demand
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mt-4">
              {/* Arc Meter Gauge */}
              <div className="col-span-5 flex flex-col items-center">
                <div className="relative w-24 h-14 flex items-end justify-center overflow-hidden">
                  <svg viewBox="0 0 100 55" className="w-full h-full">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 76 22"
                      fill="none"
                      className="stroke-emerald-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-center">
                    <span className="text-xl font-bold font-header text-slate-900 dark:text-white leading-none block">
                      {sentimentScore}
                    </span>
                    <span className="text-[10px] font-subtitle uppercase text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                      Strong Buy
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-subtitle mt-1.5 font-medium">
                  Demand Index
                </span>
              </div>

              {/* Spot Metrics */}
              <div className="col-span-7 space-y-2.5 border-l border-slate-100 dark:border-slate-800 pl-3.5 text-xs font-subtitle">
                <div>
                  <span className="text-xs text-slate-400 font-subtitle block font-medium">24K Pure Gram</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {formatCurrency(purePricePerGram, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-subtitle block font-medium">Spot ({unitInfo.name})</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      {formatCurrency(purePricePerGram * unitInfo.gramsPerUnit, currency)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? (
                        <svg viewBox="0 0 10 8" className="w-2 h-2 fill-current shrink-0" aria-hidden="true">
                          <path d="M5 1L9.5 7.5H0.5L5 1Z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 10 8" className="w-2 h-2 fill-current shrink-0" aria-hidden="true">
                          <path d="M5 7L0.5 0.5H9.5L5 7Z" />
                        </svg>
                      )}
                      <span>{Math.abs(data.changePercent).toFixed(2)}%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-subtitle text-slate-500 dark:text-slate-400 font-medium">
            <span>24h Range:</span>
            <span>{formatCurrency(lowInCurrency / GRAMS_PER_TROY_OUNCE, currency)} - {formatCurrency(highInCurrency / GRAMS_PER_TROY_OUNCE, currency)}</span>
          </div>
        </div>

        {/* CARD 2: TRENDING PURITIES (TOP KARATS LIST) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-header font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                Trending Karats
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </span>
              <span className="text-xs font-subtitle text-slate-400 font-medium">
                Ranked by Demand
              </span>
            </div>

            <div className="mt-3.5 space-y-2 font-subtitle text-sm">
              {topTrending.map((item, idx) => (
                <div key={item.karat} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs text-slate-400 font-semibold">{idx + 1}</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {item.karat}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      ({item.fineness})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {formatCurrency(item.pricePerGram, currency)}/g
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        item.changePercent24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {item.changePercent24h >= 0 ? (
                        <svg viewBox="0 0 10 8" className="w-2 h-2 fill-current shrink-0" aria-hidden="true">
                          <path d="M5 1L9.5 7.5H0.5L5 1Z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 10 8" className="w-2 h-2 fill-current shrink-0" aria-hidden="true">
                          <path d="M5 7L0.5 0.5H9.5L5 7Z" />
                        </svg>
                      )}
                      <span>{Math.abs(item.changePercent24h).toFixed(2)}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 text-xs text-slate-400 font-subtitle flex justify-between font-medium">
            <span>Standard Purity Tolerance</span>
            <span>ISO 9202</span>
          </div>
        </div>

        {/* CARD 3: LIQUIDATION & MELT SPREAD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-header font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                Melt &amp; Liquidation
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </span>
              <span className="text-xs font-subtitle text-slate-400 font-medium">
                Interbank Desk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-3.5 font-subtitle">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-subtitle font-medium block">Melt Buyback</span>
                <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">
                  -4.0%
                </span>
                <span className="text-xs text-slate-500 font-medium">Melt discount</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-subtitle font-medium block">Retail Margin</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  +5.0%
                </span>
                <span className="text-xs text-slate-500 font-medium">Standard hallmark</span>
              </div>
            </div>

            {/* Simulated CMC Bar Histogram */}
            <div className="mt-3.5">
              <div className="flex items-end gap-1 h-7 w-full">
                {[30, 45, 60, 40, 80, 55, 90, 70, 85, 95, 65, 80, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-xs ${i % 3 === 0 ? 'bg-amber-500/80' : 'bg-emerald-500/80'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-subtitle text-slate-500 dark:text-slate-400 font-medium">
            <span>Interbank Spread:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(spreadPerGram, currency)}/g (0.30%)
            </span>
          </div>
        </div>

        {/* CARD 4: VAULT DESK HIGHLIGHT (CoinDepo Inspo) */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-header uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-950 rounded-md border border-amber-400/40">
                <ScaleIcon className="w-3.5 h-3.5" />
                Physical Vault Desk
              </span>
              <span className="text-xs font-subtitle text-amber-700 dark:text-amber-400 font-semibold">
                LBMA Spot
              </span>
            </div>

            <div className="mt-3.5">
              <h4 className="text-lg font-bold font-header text-slate-900 dark:text-white uppercase leading-snug tracking-tight">
                Accurate Realtime Karat Valuation
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-subtitle leading-relaxed">
                Compute pure metal melt value vs retail craftsmanship without markups or lockups.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-amber-500/20">
            <button
              type="button"
              onClick={onOpenCalculator}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold font-header uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CalculatorIcon className="w-4 h-4" />
              <span>Open Valuation Desk</span>
            </button>
          </div>
        </div>

      </div>

      {/* TOPIC & QUICK HIGHLIGHT STRIP (Like CMC's Topic Pills) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-subtitle font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 rounded-full border border-amber-300 dark:border-amber-800 shrink-0">
          Spot Alert
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-subtitle text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Bangko Sentral ng Pilipinas Bullion Valuation Pegged at ₱160.6k / oz
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-subtitle text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          24K Pure Gold (999) High-Fineness Trading Volume Active
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-subtitle text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shrink-0">
          <ShieldCheckIcon className="w-4 h-4 text-slate-400" />
          ISO 9202 Legal Hallmarking Standards Active
        </span>
      </div>

    </div>
  );
}
