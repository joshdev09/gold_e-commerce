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

// Catmull-Rom to Cubic Bezier path generator for smooth organic curves
function getSmoothCurvePath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
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

  const { minPrice, maxPrice, endPrice, changePercent } = useMemo(() => {
    if (dataSeries.length === 0) {
      return { minPrice: 0, maxPrice: 0, endPrice: 0, changePercent: 0 };
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
      changePercent: pct,
    };
  }, [dataSeries]);

  const isPositive = changePercent >= 0;

  const svgWidth = 720;
  const svgHeight = 250;
  const paddingLeft = 16;
  const paddingRight = 64;
  const paddingTop = 20;
  const paddingBottom = 24;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const priceRange = Math.max(0.01, maxPrice - minPrice);

  const coordinates = useMemo(() => {
    if (dataSeries.length === 0) return [];
    return dataSeries.map((d, index) => {
      const x = paddingLeft + (index / (dataSeries.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((d.priceInCurrency - minPrice) / priceRange) * chartHeight;
      return { x, y, data: d };
    });
  }, [dataSeries, minPrice, priceRange, chartWidth, chartHeight, paddingLeft, paddingTop]);

  const smoothLinePath = useMemo(() => {
    return getSmoothCurvePath(coordinates);
  }, [coordinates]);

  const smoothAreaPath = useMemo(() => {
    if (coordinates.length === 0) return '';
    const bottomY = paddingTop + chartHeight;
    const firstX = coordinates[0].x;
    const lastX = coordinates[coordinates.length - 1].x;
    return `${smoothLinePath} L ${lastX.toFixed(1)} ${bottomY} L ${firstX.toFixed(1)} ${bottomY} Z`;
  }, [smoothLinePath, coordinates, paddingTop, chartHeight]);

  const activePoint = hoveredPoint || dataSeries[dataSeries.length - 1];
  const activePriceInCurrency = activePoint
    ? (viewMode === 'gram' ? activePoint.priceGramUSD : activePoint.priceOunceUSD) * currencyRate
    : endPrice;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 sm:p-8 space-y-6 shadow-xs transition-colors">
      
      {/* Top Header with Price, Trend, and Clean Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-header font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Spot Bullion Price Trend
          </span>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-header text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(activePriceInCurrency, currency)}
            </span>
            <span className="text-xs font-subtitle text-slate-400 font-medium">
              / {viewMode === 'gram' ? 'g' : 'oz'}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full font-subtitle ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
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
              <span>{Math.abs(changePercent).toFixed(2)}%</span>
            </span>
          </div>
        </div>

        {/* View Mode & Timeframe Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Toggle: Gram vs Ounce */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-xl flex">
            <button
              type="button"
              onClick={() => setViewMode('gram')}
              className={`px-3 py-1.5 text-xs font-subtitle font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                viewMode === 'gram'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gram
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ounce')}
              className={`px-3 py-1.5 text-xs font-subtitle font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                viewMode === 'ounce'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ounce
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-xl flex">
            {(['24H', '7D', '30D', '90D', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 text-xs font-subtitle font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Smooth Curve Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="chartSmoothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle Horizontal Reference Gridlines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={svgWidth - paddingRight}
            y2={paddingTop}
            className="stroke-slate-200/70 dark:stroke-slate-800"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight / 2}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight / 2}
            className="stroke-slate-200/70 dark:stroke-slate-800"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + chartHeight}
            className="stroke-slate-200/70 dark:stroke-slate-800"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Right Axis Labels: Clean and Unobtrusive */}
          <text
            x={svgWidth - paddingRight + 12}
            y={paddingTop + 4}
            className="text-[10px] font-mono fill-slate-400 font-semibold"
          >
            {formatCurrency(maxPrice, currency)}
          </text>
          <text
            x={svgWidth - paddingRight + 12}
            y={paddingTop + chartHeight + 4}
            className="text-[10px] font-mono fill-slate-400 font-semibold"
          >
            {formatCurrency(minPrice, currency)}
          </text>

          {/* Smooth Gradient Area Fill */}
          <path
            d={smoothAreaPath}
            fill="url(#chartSmoothGrad)"
          />

          {/* Smooth Primary Trend Curve */}
          <path
            d={smoothLinePath}
            fill="none"
            className="stroke-emerald-600 dark:stroke-emerald-400"
            strokeWidth="2.5"
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
                    y1={paddingTop}
                    x2={coord.x}
                    y2={paddingTop + chartHeight}
                    className="stroke-emerald-500/50"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="5"
                    className="fill-emerald-500 stroke-white dark:stroke-slate-900 shadow-sm"
                    strokeWidth="2.5"
                  />
                </>
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 left-6 bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 text-xs font-mono pointer-events-none z-10 shadow-lg backdrop-blur-xs">
            <div className="text-slate-400 text-[10px] uppercase font-subtitle">{hoveredPoint.date}</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {formatCurrency(
                (viewMode === 'gram' ? hoveredPoint.priceGramUSD : hoveredPoint.priceOunceUSD) *
                  currencyRate,
                currency
              )}
            </div>
            <div className="text-[10px] text-slate-300 font-subtitle">
              Spot per {viewMode === 'gram' ? 'gram' : 'troy oz'}
            </div>
          </div>
        )}
      </div>

      {/* Unified 4-Column Metric Strip (Replaces the chunky 4 boxes) */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-subtitle">
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">Period Range</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block text-sm">
            {timeframe} Interval
          </span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">Period High</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block text-sm">
            {formatCurrency(maxPrice, currency)}
          </span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">Period Low</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block text-sm">
            {formatCurrency(minPrice, currency)}
          </span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase block font-semibold">Spread Range</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block text-sm">
            {formatCurrency(maxPrice - minPrice, currency)}
          </span>
        </div>
      </div>

    </div>
  );
}
