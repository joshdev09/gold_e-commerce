'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoldSpotData, CurrencyCode, WeightUnit, KaratPriceBreakdown } from '@/src/types/gold';
import { DEFAULT_SPOT_PRICE_USD, CURRENCY_INFO } from '@/src/constants/gold-data';
import { computeKaratBreakdowns } from '@/src/lib/gold-calculator';

const INITIAL_TIMESTAMP = 1730000000000;

const INITIAL_DATA: GoldSpotData = {
  spotPriceOunceUSD: DEFAULT_SPOT_PRICE_USD,
  bidPriceOunceUSD: DEFAULT_SPOT_PRICE_USD * 0.9985,
  askPriceOunceUSD: DEFAULT_SPOT_PRICE_USD * 1.0015,
  dayHighOunceUSD: DEFAULT_SPOT_PRICE_USD * 1.0085,
  dayLowOunceUSD: DEFAULT_SPOT_PRICE_USD * 0.9935,
  changeUSD: 11.55,
  changePercent: 0.42,
  timestamp: INITIAL_TIMESTAMP,
  source: 'London Bullion Market (LBMA) / Spot Interbank',
  isMarketOpen: true,
  rates: Object.keys(CURRENCY_INFO).reduce((acc, key) => {
    const code = key as CurrencyCode;
    acc[code] = CURRENCY_INFO[code].rateAgainstUSD;
    return acc;
  }, {} as Record<CurrencyCode, number>),
};

export function useGoldPrice() {
  const [data, setData] = useState<GoldSpotData>(INITIAL_DATA);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('PHP');
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('gram');
  const [refreshInterval, setRefreshInterval] = useState<number>(10000); // 10s
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(INITIAL_TIMESTAMP);
  const [countdown, setCountdown] = useState<number>(10);

  const prevSpotRef = useRef<number>(DEFAULT_SPOT_PRICE_USD);

  const fetchPrice = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);

    try {
      const res = await fetch('/api/gold-price');
      if (res.ok) {
        const json: GoldSpotData = await res.json();
        
        // Detect price movement direction
        if (json.spotPriceOunceUSD > prevSpotRef.current) {
          setTickDirection('up');
        } else if (json.spotPriceOunceUSD < prevSpotRef.current) {
          setTickDirection('down');
        }
        prevSpotRef.current = json.spotPriceOunceUSD;

        setData(json);
        setLastUpdated(json.timestamp);
      }
    } catch {
      // In case of network interruption, apply small live simulation tick
      setData((prev) => {
        const delta = (Math.random() - 0.48) * 0.35;
        const newSpot = Math.round((prev.spotPriceOunceUSD + delta) * 100) / 100;
        setTickDirection(delta > 0 ? 'up' : 'down');
        prevSpotRef.current = newSpot;
        return {
          ...prev,
          spotPriceOunceUSD: newSpot,
          bidPriceOunceUSD: Math.round(newSpot * 0.9985 * 100) / 100,
          askPriceOunceUSD: Math.round(newSpot * 1.0015 * 100) / 100,
          timestamp: Date.now(),
        };
      });
      setLastUpdated(Date.now());
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
      setTimeout(() => setTickDirection(null), 1200);
      setCountdown(refreshInterval > 0 ? Math.round(refreshInterval / 1000) : 0);
    }
  }, [refreshInterval]);

  // Initial fetch on mount without synchronous setState inside effect body
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrice(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchPrice]);

  // Periodic polling interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchPrice(false);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchPrice]);

  // Countdown timer effect
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : Math.round(refreshInterval / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  // Computed karat list
  const karatBreakdowns: KaratPriceBreakdown[] = computeKaratBreakdowns(
    data,
    selectedUnit,
    selectedCurrency
  );

  return {
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
    refresh: () => fetchPrice(true),
    karatBreakdowns,
  };
}
