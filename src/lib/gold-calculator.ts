import {
  KaratDefinition,
  KaratPriceBreakdown,
  WeightUnit,
  CurrencyCode,
  GoldSpotData,
  JewelryCalculationInput,
  JewelryCalculationResult,
  HistoricalPricePoint,
  Timeframe,
} from '@/src/types/gold';
import {
  GRAMS_PER_TROY_OUNCE,
  KARAT_DEFINITIONS,
  WEIGHT_UNITS,
  DEFAULT_MELT_BUYBACK_MARGIN,
  DEFAULT_RETAIL_SELL_MARGIN,
} from '@/src/constants/gold-data';

/**
 * Calculates raw price per gram for a given karat purity and currency rate
 */
export function calculateKaratPricePerGram(
  spotPriceOunceUSD: number,
  purity: number,
  currencyRate: number = 1.0
): number {
  const pricePerGramUSD = (spotPriceOunceUSD / GRAMS_PER_TROY_OUNCE) * purity;
  return pricePerGramUSD * currencyRate;
}

/**
 * Computes price breakdown for all standard karats
 */
export function computeKaratBreakdowns(
  spotData: GoldSpotData,
  selectedUnit: WeightUnit = 'gram',
  selectedCurrency: CurrencyCode = 'USD'
): KaratPriceBreakdown[] {
  const currencyRate = spotData.rates[selectedCurrency] ?? 1.0;
  const unitGrams = WEIGHT_UNITS[selectedUnit].gramsPerUnit;
  const changePercent = spotData.changePercent;

  return KARAT_DEFINITIONS.map((def: KaratDefinition) => {
    const pricePerGram = calculateKaratPricePerGram(
      spotData.spotPriceOunceUSD,
      def.purity,
      currencyRate
    );

    const pricePerSelectedUnit = pricePerGram * unitGrams;
    const buyRatePerGram = pricePerGram * DEFAULT_MELT_BUYBACK_MARGIN;
    const sellRatePerGram = pricePerGram * DEFAULT_RETAIL_SELL_MARGIN;
    const price5g = pricePerGram * 5;
    const price10g = pricePerGram * 10;
    const priceOunce = pricePerGram * GRAMS_PER_TROY_OUNCE;
    const change24hGram = pricePerGram * (changePercent / 100);

    return {
      karat: def.karat,
      purity: def.purity,
      fineness: def.fineness,
      hallmark: def.hallmark,
      name: def.name,
      commonUse: def.commonUse,
      pricePerGram,
      pricePerSelectedUnit,
      buyRatePerGram,
      sellRatePerGram,
      price5g,
      price10g,
      priceOunce,
      change24hGram,
      changePercent24h: changePercent,
    };
  });
}

/**
 * Computes valuation for custom jewelry pieces
 */
export function calculateJewelryValuation(
  input: JewelryCalculationInput,
  spotData: GoldSpotData
): JewelryCalculationResult {
  const def = KARAT_DEFINITIONS.find((k) => k.karat === input.karat) || KARAT_DEFINITIONS[0];
  const unitGrams = WEIGHT_UNITS[input.unit].gramsPerUnit;
  const weightInGrams = Math.max(0, input.weight * unitGrams);
  const pureGoldGrams = weightInGrams * def.purity;

  const currencyRate = spotData.rates[input.currency] ?? 1.0;
  const pricePerGram = calculateKaratPricePerGram(
    spotData.spotPriceOunceUSD,
    def.purity,
    currencyRate
  );

  const rawGoldValue = weightInGrams * pricePerGram;
  const makingFeeValue = rawGoldValue * (Math.max(0, input.makingFeePercent) / 100);
  const subtotal = rawGoldValue + makingFeeValue + (input.customMarkupFixed || 0);
  const vatValue = subtotal * (Math.max(0, input.vatPercent) / 100);
  const totalRetailValue = subtotal + vatValue;
  const meltValue = weightInGrams * pricePerGram * DEFAULT_MELT_BUYBACK_MARGIN;
  const pricePerGramEffective = weightInGrams > 0 ? totalRetailValue / weightInGrams : 0;

  return {
    weightInGrams,
    pureGoldGrams,
    rawGoldValue,
    makingFeeValue,
    vatValue,
    totalRetailValue,
    meltValue,
    pricePerGramEffective,
    karat: input.karat,
    currency: input.currency,
  };
}

/**
 * Converts a weight value between units
 */
export function convertWeight(amount: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  const grams = amount * WEIGHT_UNITS[fromUnit].gramsPerUnit;
  return grams / WEIGHT_UNITS[toUnit].gramsPerUnit;
}

/**
 * Generates smooth, realistic historical price data points for charts
 */
export function generateHistoricalPoints(
  timeframe: Timeframe,
  currentSpotUSD: number
): HistoricalPricePoint[] {
  const points: HistoricalPricePoint[] = [];
  const now = Date.now();

  let count = 24;
  let intervalMs = 60 * 60 * 1000;
  let baseVolatility = 0.0018;

  switch (timeframe) {
    case '24H':
      count = 24;
      intervalMs = 3600 * 1000;
      baseVolatility = 0.0015;
      break;
    case '7D':
      count = 28;
      intervalMs = 6 * 3600 * 1000;
      baseVolatility = 0.0035;
      break;
    case '30D':
      count = 30;
      intervalMs = 24 * 3600 * 1000;
      baseVolatility = 0.005;
      break;
    case '90D':
      count = 45;
      intervalMs = 2 * 24 * 3600 * 1000;
      baseVolatility = 0.007;
      break;
    case '1Y':
      count = 52;
      intervalMs = 7 * 24 * 3600 * 1000;
      baseVolatility = 0.012;
      break;
  }

  const prices: number[] = [currentSpotUSD];
  let curPrice = currentSpotUSD;

  const seedMultiplier = timeframe.charCodeAt(0) * 17;
  for (let i = 1; i < count; i++) {
    const pseudoRandom = Math.sin((i + seedMultiplier) * 1.3) * 0.7 + Math.cos(i * 0.9) * 0.3;
    const drift = timeframe === '1Y' ? -0.0015 : timeframe === '90D' ? -0.0008 : 0.0001;
    const changeFactor = 1 + (pseudoRandom * baseVolatility + drift);
    curPrice = curPrice / changeFactor;
    prices.unshift(curPrice);
  }

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - 1 - i) * intervalMs;
    const dateObj = new Date(timestamp);

    let dateLabel = '';
    if (timeframe === '24H') {
      dateLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (timeframe === '7D' || timeframe === '30D') {
      dateLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      dateLabel = dateObj.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }

    const priceOunce = prices[i];
    const priceGram = priceOunce / GRAMS_PER_TROY_OUNCE;

    points.push({
      timestamp,
      date: dateLabel,
      priceOunceUSD: Math.round(priceOunce * 100) / 100,
      priceGramUSD: Math.round(priceGram * 100) / 100,
    });
  }

  return points;
}
