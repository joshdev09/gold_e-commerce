import { KaratDefinition, UnitInfo, CurrencyInfo, CurrencyCode, WeightUnit } from '@/src/types/gold';

export const GRAMS_PER_TROY_OUNCE = 31.1034768;

export const KARAT_DEFINITIONS: KaratDefinition[] = [
  {
    karat: '24K',
    name: '24 Karat Gold',
    purity: 0.999,
    fineness: 999,
    hallmark: '999',
    commonUse: 'Investment Bullion, Cast Bars & Pure Mint Coins',
    description: 'Pure 99.9% gold. Soft and malleable, standard benchmark for international gold market pricing.',
  },
  {
    karat: '22K',
    name: '22 Karat Gold',
    purity: 0.9167,
    fineness: 916,
    hallmark: '916',
    commonUse: 'Traditional Asian, Indian & Middle Eastern Fine Jewelry',
    description: 'Composed of 91.67% gold alloyed with silver and copper for increased wear resistance.',
  },
  {
    karat: '21K',
    name: '21 Karat Gold',
    purity: 0.875,
    fineness: 875,
    hallmark: '875',
    commonUse: 'Arabian Gulf, Southeast Asian & Mediterranean Jewelry',
    description: 'Contains 87.5% gold. Popular across the Middle East for ornate bridal jewelry.',
  },
  {
    karat: '18K',
    name: '18 Karat Gold',
    purity: 0.75,
    fineness: 750,
    hallmark: '750',
    commonUse: 'Luxury European Jewelry, Cartier, Rolex & Engagement Rings',
    description: 'Composed of 75.0% pure gold. Provides the ideal balance between rich color and mechanical durability.',
  },
  {
    karat: '14K',
    name: '14 Karat Gold',
    purity: 0.5833,
    fineness: 585,
    hallmark: '585',
    commonUse: 'Standard North American Everyday Jewelry & Wedding Bands',
    description: 'Contains 58.33% gold. Highly resistant to scratching, ideal for daily wear items.',
  },
  {
    karat: '10K',
    name: '10 Karat Gold',
    purity: 0.4167,
    fineness: 417,
    hallmark: '417',
    commonUse: 'Affordable Commercial Rings, Pendants & Heavy Wear Chains',
    description: 'Contains 41.67% gold. The minimum legal standard to be marketed as solid gold in the United States.',
  },
  {
    karat: '9K',
    name: '9 Karat Gold',
    purity: 0.375,
    fineness: 375,
    hallmark: '375',
    commonUse: 'British & Commonwealth Standard Jewelry & Antique Pieces',
    description: 'Contains 37.5% gold. Widely used and hallmarked in the United Kingdom, Australia, and New Zealand.',
  },
];

export const WEIGHT_UNITS: Record<WeightUnit, UnitInfo> = {
  gram: {
    unit: 'gram',
    name: 'Gram',
    symbol: 'g',
    gramsPerUnit: 1,
  },
  oz: {
    unit: 'oz',
    name: 'Troy Ounce',
    symbol: 'oz t',
    gramsPerUnit: GRAMS_PER_TROY_OUNCE,
  },
  tola: {
    unit: 'tola',
    name: 'Tola',
    symbol: 'tola',
    gramsPerUnit: 11.6638038,
  },
  dwt: {
    unit: 'dwt',
    name: 'Pennyweight',
    symbol: 'dwt',
    gramsPerUnit: 1.55517384,
  },
  kg: {
    unit: 'kg',
    name: 'Kilogram',
    symbol: 'kg',
    gramsPerUnit: 1000,
  },
};

export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateAgainstUSD: 1.0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateAgainstUSD: 0.922 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateAgainstUSD: 0.788 },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rateAgainstUSD: 58.45 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', rateAgainstUSD: 3.6725 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateAgainstUSD: 86.85 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateAgainstUSD: 1.398 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rateAgainstUSD: 1.545 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', rateAgainstUSD: 1.342 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateAgainstUSD: 153.2 },
};

export const DEFAULT_SPOT_PRICE_USD = 2748.80; // Current real market spot price range
export const DEFAULT_BID_SPREAD = 0.9985; // 0.15% bid discount
export const DEFAULT_ASK_SPREAD = 1.0015; // 0.15% ask premium
export const DEFAULT_MELT_BUYBACK_MARGIN = 0.96; // 4% discount for scrap/melt purchase
export const DEFAULT_RETAIL_SELL_MARGIN = 1.05; // 5% retail craftsmanship baseline
