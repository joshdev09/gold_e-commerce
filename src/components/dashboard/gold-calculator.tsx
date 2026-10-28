'use client';

import React, { useState } from 'react';
import { KaratType, WeightUnit, CurrencyCode, GoldSpotData } from '@/src/types/gold';
import { KARAT_DEFINITIONS, WEIGHT_UNITS } from '@/src/constants/gold-data';
import { calculateJewelryValuation } from '@/src/lib/gold-calculator';
import { formatCurrency, formatWeight } from '@/src/lib/formatters';

interface GoldCalculatorProps {
  spotData: GoldSpotData;
  currency: CurrencyCode;
  selectedKaratProp?: KaratType;
}

export function GoldCalculator({
  spotData,
  currency,
  selectedKaratProp,
}: GoldCalculatorProps) {
  const [karat, setKarat] = useState<KaratType>(selectedKaratProp || '18K');
  const [prevProp, setPrevProp] = useState<KaratType | undefined>(selectedKaratProp);
  const [weight, setWeight] = useState<number>(10);
  const [unit, setUnit] = useState<WeightUnit>('gram');
  const [makingFeePercent, setMakingFeePercent] = useState<number>(8);
  const [vatPercent, setVatPercent] = useState<number>(0);

  if (selectedKaratProp && selectedKaratProp !== prevProp) {
    setPrevProp(selectedKaratProp);
    setKarat(selectedKaratProp);
  }

  const activeDef = KARAT_DEFINITIONS.find((k) => k.karat === karat) || KARAT_DEFINITIONS[0];

  const result = calculateJewelryValuation(
    {
      karat,
      weight,
      unit,
      currency,
      makingFeePercent,
      vatPercent,
    },
    spotData
  );

  const quickWeights = [
    { label: '1g', weight: 1, unit: 'gram' as WeightUnit },
    { label: '5g', weight: 5, unit: 'gram' as WeightUnit },
    { label: '10g', weight: 10, unit: 'gram' as WeightUnit },
    { label: '1 Tola', weight: 1, unit: 'tola' as WeightUnit },
    { label: '1 Troy Oz', weight: 1, unit: 'oz' as WeightUnit },
  ];

  return (
    <div
      id="gold-calculator"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 sm:p-8 space-y-7 shadow-xs transition-colors"
    >
      {/* Clean Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-header text-slate-900 dark:text-white tracking-tight">
            Gold Valuation Desk
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-subtitle">
            Calculate accurate melt value, craftsmanship, and total retail pricing on spot basis.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-subtitle">
          Live Spot
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Karat Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-header font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Purity / Karat
              </label>
              <span className="text-xs font-subtitle text-slate-400">
                {(activeDef.purity * 100).toFixed(1)}% pure gold
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {KARAT_DEFINITIONS.map((def) => {
                const isSelected = karat === def.karat;
                return (
                  <button
                    key={def.karat}
                    type="button"
                    onClick={() => setKarat(def.karat)}
                    className={`py-2.5 px-1.5 text-center rounded-xl border transition-all cursor-pointer font-subtitle ${
                      isSelected
                        ? 'bg-[#0f3d2e] dark:bg-[#0f3d2e] text-white border-[#1b5e47] shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="block text-sm font-bold font-header">{def.karat}</span>
                    <span className="block text-[11px] opacity-75 mt-0.5 font-medium">{def.fineness}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-subtitle">
              <span>Selected:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDef.name}</span>
              <span>•</span>
              <span>Hallmark {activeDef.hallmark}</span>
            </div>
          </div>

          {/* 2. Weight and Unit Input */}
          <div>
            <label className="text-xs font-header font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
              2. Weight &amp; Measurement
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Weight Number Input */}
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-lg font-bold font-header bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="Enter weight..."
                />
              </div>

              {/* Segmented Unit Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                {Object.values(WEIGHT_UNITS).map((u) => (
                  <button
                    key={u.unit}
                    type="button"
                    onClick={() => setUnit(u.unit)}
                    className={`px-3 py-1.5 text-xs font-subtitle font-semibold uppercase rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      unit === u.unit
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {u.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset quick weights */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-subtitle text-slate-400 font-medium mr-1">Presets:</span>
              {quickWeights.map((qw) => (
                <button
                  key={qw.label}
                  type="button"
                  onClick={() => {
                    setWeight(qw.weight);
                    setUnit(qw.unit);
                  }}
                  className="px-3 py-1 text-xs font-subtitle font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {qw.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Labor Fee & VAT Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            {/* Making Fee */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-header font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Making / Labor Fee
                </span>
                <span className="text-sm font-bold font-header text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                  {makingFeePercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={makingFeePercent}
                onChange={(e) => setMakingFeePercent(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-subtitle text-slate-400 mt-1.5">
                <span>0% Bullion</span>
                <span>8% Standard</span>
                <span>15% Fine</span>
              </div>
            </div>

            {/* VAT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-header font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sales Tax / VAT
                </span>
                <span className="text-sm font-bold font-header text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                  {vatPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={vatPercent}
                onChange={(e) => setVatPercent(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-subtitle text-slate-400 mt-1.5">
                <span>0% Exempt</span>
                <span>5% Standard</span>
                <span>12% VAT</span>
              </div>
            </div>
          </div>

        </div>

        {/* VALUATION RESULT SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-subtitle uppercase text-slate-400 tracking-wider font-semibold block">
              Estimated Total Valuation
            </span>
            <div className="mt-2 mb-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-header text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(result.totalRetailValue, currency)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-subtitle">
              Effective rate: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(result.pricePerGramEffective, currency)}</span> / gram
            </p>

            {/* Line Item Breakdown */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3 text-sm font-subtitle">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Pure Gold (24K):</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {result.pureGoldGrams.toFixed(2)} g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Piece Weight:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatWeight(result.weightInGrams, 'gram')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Raw Gold Metal Value:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(result.rawGoldValue, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Craftsmanship ({makingFeePercent}%):</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(result.makingFeeValue, currency)}
                </span>
              </div>
              {vatPercent > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tax / VAT ({vatPercent}%):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    +{formatCurrency(result.vatValue, currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Melt / Scrap Liquidation Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-header font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Melt / Scrap Value
              </span>
              <span className="text-base font-extrabold font-header text-slate-900 dark:text-white">
                {formatCurrency(result.meltValue, currency)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-subtitle">
              Pure raw metal liquidation value without labor or retail markup.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
