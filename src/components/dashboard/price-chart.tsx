'use client';

import React, { useState, useMemo } from 'react';
import { Timeframe, CurrencyCode, HistoricalPricePoint } from '@/src/types/gold';
import { generateHistoricalPoints } from '@/src/lib/gold-calculator';
import { formatCurrency } from '@/src/lib/formatters';

interface PriceChartProps {
  currentSpotUSD: number;
  currencyRate: number;
  currency: CurrencyCode;
}

export function PriceChart({ currentSpotUSD, currencyRate, currency }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24H');
  const [viewMode, setViewMode] = useState<'gram' | 'ounce'>('gram');
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalPricePoint | null>(null);

  const points = useMemo(() => {
    return generateHistoricalPoints(timeframe, currentSpotUSD);
  }, [timeframe, currentSpotUSD]);

  const dataSeries = useMemo(() => {
    return points.map((p) => {
      const baseUSD = viewMode === 'gram' ? p.priceGramUSD : p.priceOunceUSD;
      return {
        ...p,
        priceInCurrency: baseUSD * currencyRate,
      };
    });
  }, [points, viewMode, currencyRate]);

  const { minPrice, maxPrice, endPrice, changeAmount, changePercent } = useMemo(() => {
    if (dataSeries.length === 0) {
      return { minPrice: 0, maxPrice: 0, endPrice: 0, changeAmount: 0, changePercent: 0 };
    }
    const prices = dataSeries.map((d) => d.priceInCurrency);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const start = prices[0];
    const end = prices[prices.length - 1];
    const change = end - start;
    const pct = start > 0 ? (change / start) * 100 : 0;
    return {
      minPrice: min,
      maxPrice: max,
      endPrice: end,
      changeAmount: change,
      changePercent: pct,
    };
  }, [dataSeries]);

  const isPositive = changePercent >= 0;

  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 24;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;
  const priceRange = Math.max(0.01, maxPrice - minPrice);

  const coordinates = useMemo(() => {
    if (dataSeries.length === 0) return [];
    return dataSeries.map((d, index) => {
      const x = paddingX + (index / (dataSeries.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - ((d.priceInCurrency - minPrice) / priceRange) * chartHeight;
      return { x, y, data: d };
    });
  }, [dataSeries, minPrice, priceRange, chartWidth, chartHeight, paddingX, paddingY]);

  const linePath = useMemo(() => {
    if (coordinates.length === 0) return '';
    return coordinates.reduce((acc, curr, idx) => {
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }, '');
  }, [coordinates]);

  const areaPath = useMemo(() => {
    if (coordinates.length === 0) return '';
    const bottomY = paddingY + chartHeight;
    const firstX = coordinates[0].x;
    const lastX = coordinates[coordinates.length - 1].x;
    return `${linePath} L ${lastX.toFixed(1)} ${bottomY} L ${firstX.toFixed(1)} ${bottomY} Z`;
  }, [linePath, coordinates, paddingY, chartHeight]);

  const activePoint = hoveredPoint || dataSeries[dataSeries.length - 1];
  const activePriceInCurrency = activePoint
    ? (viewMode === 'gram' ? activePoint.priceGramUSD : activePoint.priceOunceUSD) * currencyRate
    : endPrice;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      
      {/* CoinMarketCap Inspo: Top Header with Breadcrumbs & Clean Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-subtitle uppercase text-slate-400 tracking-wider font-semibold">
            Precious Metals &gt; Physical Gold Spot
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl sm:text-4xl font-bold font-header text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(activePriceInCurrency, currency)}
            </span>
            <span className="text-sm font-subtitle text-slate-400 font-medium">/ {viewMode === 'gram' ? 'gram' : 'troy oz'}</span>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-subtitle font-bold ${
                isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isPositive ? (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-current shrink-0" aria-hidden="true">
                  <path d="M5 1L9.5 7.5H0.5L5 1Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-current shrink-0" aria-hidden="true">
                  <path d="M5 7L0.5 0.5H9.5L5 7Z" />
                </svg>
              )}
              <span>{Math.abs(changePercent).toFixed(2)}%</span>
            </span>
          </div>
        </div>

        {/* View mode & Timeframe Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Unit Toggle: Gram vs Ounce */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg flex">
            <button
              type="button"
              onClick={() => setViewMode('gram')}
              className={`px-3.5 py-2 text-sm font-semibold uppercase rounded-md transition-colors cursor-pointer font-subtitle ${
                viewMode === 'gram'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Per Gram
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ounce')}
              className={`px-3.5 py-2 text-sm font-semibold uppercase rounded-md transition-colors cursor-pointer font-subtitle ${
                viewMode === 'ounce'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Per Ounce
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg flex">
            {(['24H', '7D', '30D', '90D', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-2 text-sm font-semibold uppercase rounded-md transition-colors cursor-pointer font-subtitle ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Horizontal Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={svgWidth - paddingX}
            y2={paddingY}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartHeight / 2}
            x2={svgWidth - paddingX}
            y2={paddingY + chartHeight / 2}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY + chartHeight}
            x2={svgWidth - paddingX}
            y2={paddingY + chartHeight}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />

          {/* Grid Labels */}
          <text
            x={paddingX}
            y={paddingY - 8}
            className="text-[10px] font-mono fill-slate-400 font-semibold"
          >
            HIGH: {formatCurrency(maxPrice, currency)}
          </text>
          <text
            x={paddingX}
            y={paddingY + chartHeight + 16}
            className="text-[10px] font-mono fill-slate-400 font-semibold"
          >
            LOW: {formatCurrency(minPrice, currency)}
          </text>

          {/* Flat Area Fill */}
          <path
            d={areaPath}
            className="fill-amber-500/10 dark:fill-amber-500/15"
          />

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Interactive Mouse Hover Hotspots */}
          {coordinates.map((coord, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredPoint(coord.data)}
              className="cursor-pointer"
            >
              <rect
                x={coord.x - (chartWidth / coordinates.length) / 2}
                y={0}
                width={chartWidth / coordinates.length}
                height={svgHeight}
                fill="transparent"
              />

              {hoveredPoint && hoveredPoint.timestamp === coord.data.timestamp && (
                <>
                  <line
                    x1={coord.x}
                    y1={paddingY}
                    x2={coord.x}
                    y2={paddingY + chartHeight}
                    className="stroke-amber-500/60"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="5"
                    className="fill-amber-500 stroke-white dark:stroke-slate-900"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white p-3 rounded-lg border border-slate-700 text-xs font-mono pointer-events-none z-10 shadow-lg">
            <div className="text-slate-400 text-[10px] uppercase font-subtitle">{hoveredPoint.date}</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              {formatCurrency(
                (viewMode === 'gram' ? hoveredPoint.priceGramUSD : hoveredPoint.priceOunceUSD) *
                  currencyRate,
                currency
              )}
            </div>
            <div className="text-[10px] text-slate-300 font-subtitle">
              Gold spot per {viewMode === 'gram' ? 'gram' : 'troy oz'}
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Metrics (Spacious CoinMarketCap Grid) */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-subtitle">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-xs text-slate-400 uppercase block font-subtitle font-semibold">Period Range</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
            {timeframe} Interval
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-xs text-slate-400 uppercase block font-subtitle font-semibold">Period High</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
            {formatCurrency(maxPrice, currency)}
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-xs text-slate-400 uppercase block font-subtitle font-semibold">Period Low</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
            {formatCurrency(minPrice, currency)}
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-xs text-slate-400 uppercase block font-subtitle font-semibold">Net Volatility</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
            {formatCurrency(changeAmount, currency)} ({(((maxPrice - minPrice) / minPrice) * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
