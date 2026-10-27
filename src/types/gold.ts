export type KaratType = '24K' | '22K' | '21K' | '18K' | '14K' | '10K' | '9K';

export type WeightUnit = 'gram' | 'oz' | 'tola' | 'dwt' | 'kg';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PHP' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'SGD' | 'JPY';

export type Timeframe = '24H' | '7D' | '30D' | '90D' | '1Y';

export interface KaratDefinition {
  karat: KaratType;
  name: string;
  purity: number; // e.g. 0.999 for 24K, 0.9167 for 22K
  fineness: number; // 999, 916, 875, 750, 585, 417, 375
  hallmark: string; // '999', '916', etc.
  commonUse: string;
  description: string;
}

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateAgainstUSD: number; // 1 USD = rateAgainstUSD
}

export interface UnitInfo {
  unit: WeightUnit;
  name: string;
  symbol: string;
  gramsPerUnit: number;
}

export interface GoldSpotData {
  spotPriceOunceUSD: number;
  bidPriceOunceUSD: number;
  askPriceOunceUSD: number;
  dayHighOunceUSD: number;
  dayLowOunceUSD: number;
  changeUSD: number;
  changePercent: number;
  timestamp: number;
  source: string;
  isMarketOpen: boolean;
  rates: Record<CurrencyCode, number>;
}

export interface KaratPriceBreakdown {
  karat: KaratType;
  purity: number;
  fineness: number;
  hallmark: string;
  name: string;
  commonUse: string;
  pricePerGram: number;
  pricePerSelectedUnit: number;
  buyRatePerGram: number; // scrap / buyback
  sellRatePerGram: number; // retail / jewelry
  price5g: number;
  price10g: number;
  priceOunce: number;
  change24hGram: number;
  changePercent24h: number;
}

export interface HistoricalPricePoint {
  timestamp: number;
  date: string;
  priceOunceUSD: number;
  priceGramUSD: number;
}

export interface JewelryCalculationInput {
  karat: KaratType;
  weight: number;
  unit: WeightUnit;
  currency: CurrencyCode;
  makingFeePercent: number;
  vatPercent: number;
  customMarkupFixed?: number;
}

export interface JewelryCalculationResult {
  weightInGrams: number;
  pureGoldGrams: number;
  rawGoldValue: number;
  makingFeeValue: number;
  vatValue: number;
  totalRetailValue: number;
  meltValue: number;
  pricePerGramEffective: number;
  karat: KaratType;
  currency: CurrencyCode;
}
