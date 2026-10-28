'use client';

import React, { useState } from 'react';
import { useGoldPrice } from '@/src/hooks/use-gold-price';
import { KaratType } from '@/src/types/gold';
import { Header } from '@/src/components/dashboard/header';
import { MarketOverview } from '@/src/components/dashboard/market-overview';
import { KaratGrid } from '@/src/components/dashboard/karat-grid';
import { GoldCalculator } from '@/src/components/dashboard/gold-calculator';
import { PriceChart } from '@/src/components/dashboard/price-chart';
import { KaratTable } from '@/src/components/dashboard/karat-table';
import { MarketInsights } from '@/src/components/dashboard/market-insights';
import { Footer } from '@/src/components/dashboard/footer';

export default function Home() {
  const {
    data,
    selectedCurrency,
    setSelectedCurrency,
    selectedUnit,
    setSelectedUnit,
    refreshInterval,
    setRefreshInterval,
    isRefreshing,
    tickDirection,
    lastUpdated,
    countdown,
    refresh,
    karatBreakdowns,
  } = useGoldPrice();

  const [calculatorKarat, setCalculatorKarat] = useState<KaratType>('18K');

  const handleSelectForCalculation = (karat: KaratType) => {
    setCalculatorKarat(karat);
    const element = document.getElementById('gold-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCalculator = () => {
    const element = document.getElementById('gold-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currencyRate = data.rates[selectedCurrency] ?? 1.0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-subtitle transition-colors selection:bg-amber-500 selection:text-white">
      {/* 1. Header with vector brand emblem, live indicator, currency/unit controls, and MagicUI animated theme toggler */}
      <Header
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={setRefreshInterval}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        countdown={countdown}
        lastUpdated={lastUpdated}
        rates={data.rates}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
        
        {/* 1. Market Overview Terminal Cards (At top of table) */}
        <section aria-label="Market Overview" className="animate-fade-in-up">
          <MarketOverview
            data={data}
            currency={selectedCurrency}
            selectedUnit={selectedUnit}
            tickDirection={tickDirection}
            karats={karatBreakdowns}
            onOpenCalculator={handleScrollToCalculator}
          />
        </section>

        {/* 2. Karat & Gram Price Comparison Matrix */}
        <section id="karat-table" aria-label="Karat & Gram Price Comparison Matrix" className="animate-fade-in-up delay-100">
          <KaratTable
            karats={karatBreakdowns}
            currency={selectedCurrency}
            tickDirection={tickDirection}
            onSelectForCalculation={handleSelectForCalculation}
          />
        </section>

        {/* Realtime Karat Cards Grid (24K, 22K, 21K, 18K, 14K, 10K, 9K) */}
        <section id="karat-grid" aria-label="Realtime Karat Prices" className="animate-fade-in-up delay-200">
          <KaratGrid
            karats={karatBreakdowns}
            currency={selectedCurrency}
            selectedUnit={selectedUnit}
            onSelectForCalculation={handleSelectForCalculation}
          />
        </section>

        {/* Two-Column Grid: Realtime Calculator & Interactive Flat Chart */}
        <section aria-label="Calculator and Trends" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in-up delay-300">
          <div className="xl:col-span-7">
            <GoldCalculator
              spotData={data}
              currency={selectedCurrency}
              selectedKaratProp={calculatorKarat}
            />
          </div>
          <div id="price-chart" className="xl:col-span-5">
            <PriceChart
              currentSpotUSD={data.spotPriceOunceUSD}
              currencyRate={currencyRate}
              currency={selectedCurrency}
            />
          </div>
        </section>

        {/* Market Insights & Purity Standards */}
        <section id="market-insights" aria-label="Market Insights">
          <MarketInsights />
        </section>

      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
