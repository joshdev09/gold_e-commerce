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
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-7 shadow-sm transition-colors"
    >
      {/* Clean Header (No unnecessary icon) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-2xl font-bold font-header text-slate-900 dark:text-white uppercase tracking-tight">
            Realtime Gold Karat &amp; Gram Valuation Calculator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-subtitle">
            Instantly compute raw metal melt value and estimated retail jewelry pricing.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline font-medium">
          Live Spot Basis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Karat Selection */}
          <div>
            <label className="text-xs font-header font-bold uppercase text-slate-500 dark:text-slate-400 block mb-2.5">
              1. Select Gold Karat / Purity
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {KARAT_DEFINITIONS.map((def) => {
                const isSelected = karat === def.karat;
                return (
                  <button
                    key={def.karat}
                    type="button"
                    onClick={() => setKarat(def.karat)}
                    className={`py-2.5 px-1.5 text-center border font-subtitle rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-sm font-bold font-header">{def.karat}</span>
                    <span className="block text-xs opacity-80 mt-0.5">{def.fineness}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 font-subtitle">
              Selected: <strong className="text-slate-800 dark:text-slate-200 font-header">{activeDef.name}</strong> ({(activeDef.purity * 100).toFixed(1)}% pure gold / hallmark {activeDef.hallmark})
            </p>
          </div>

          {/* Weight & Unit Input */}
          <div>
            <label className="text-xs font-header font-bold uppercase text-slate-500 dark:text-slate-400 block mb-2.5">
              2. Weight and Measurement Unit
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-base font-subtitle font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Enter weight..."
                />
              </div>

              {/* Unit selector pills */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg overflow-x-auto">
                {Object.values(WEIGHT_UNITS).map((u) => (
                  <button
                    key={u.unit}
                    type="button"
                    onClick={() => setUnit(u.unit)}
                    className={`px-3.5 py-1.5 text-xs font-subtitle font-semibold uppercase rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      unit === u.unit
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {u.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick preset weight chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span className="text-xs font-subtitle text-slate-400 uppercase font-semibold">Presets:</span>
              {quickWeights.map((qw) => (
                <button
                  key={qw.label}
                  type="button"
                  onClick={() => {
                    setWeight(qw.weight);
                    setUnit(qw.unit);
                  }}
                  className="px-3.5 py-1.5 text-xs font-subtitle font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {qw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges / Craftsmanship & Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-header font-bold uppercase text-slate-500 dark:text-slate-400">
                  Making / Labor Fee
                </label>
                <span className="text-sm font-subtitle font-bold text-slate-800 dark:text-slate-200">
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
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-subtitle text-slate-400 mt-1.5">
                <span>0% (Raw Bullion)</span>
                <span>15% (Fine Jewelry)</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-header font-bold uppercase text-slate-500 dark:text-slate-400">
                  Sales Tax / VAT
                </label>
                <span className="text-sm font-subtitle font-bold text-slate-800 dark:text-slate-200">
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
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-subtitle text-slate-400 mt-1.5">
                <span>0% (Exempt)</span>
                <span>5% (UAE)</span>
                <span>12% (VAT)</span>
              </div>
            </div>
          </div>

        </div>

        {/* RESULTS PANEL (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <span className="text-xs font-subtitle uppercase text-slate-400 tracking-wider block font-bold">
              Estimated Total Valuation
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-bold font-header text-amber-600 dark:text-amber-400 tracking-tight">
                {formatCurrency(result.totalRetailValue, currency)}
              </span>
            </div>
            <p className="text-sm font-subtitle text-slate-500 dark:text-slate-400 mt-1.5">
              Effective rate: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(result.pricePerGramEffective, currency)}</span> / gram
            </p>

            {/* Pure Gold Content Breakdown */}
            <div className="my-6 p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between text-sm font-subtitle">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Pure Gold Content:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {result.pureGoldGrams.toFixed(2)} g (24K)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-subtitle mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Piece Weight:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatWeight(result.weightInGrams, 'gram')}
                </span>
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="space-y-3 text-sm font-subtitle border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="font-medium">Raw Gold Metal Value:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(result.rawGoldValue, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="font-medium">Craftsmanship / Making ({makingFeePercent}%):</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(result.makingFeeValue, currency)}
                </span>
              </div>
              {vatPercent > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Sales Tax / VAT ({vatPercent}%):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(result.vatValue, currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Melt / Scrap Buyback Box */}
          <div className="mt-6 p-4.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-sm font-subtitle">
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                Melt / Scrap Value:
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(result.meltValue, currency)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-subtitle leading-relaxed">
              Estimated raw liquidation / cash-for-gold value without labor or stone additions.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
