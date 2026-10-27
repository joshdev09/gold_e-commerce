import { CurrencyCode, WeightUnit } from '@/src/types/gold';
import { CURRENCY_INFO, WEIGHT_UNITS } from '@/src/constants/gold-data';

/**
 * Formats a monetary amount with currency symbol and precision
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  decimals: number = 2
): string {
  const info = CURRENCY_INFO[currencyCode] || CURRENCY_INFO.USD;
  const isJpy = currencyCode === 'JPY';
  const effectiveDecimals = isJpy ? 0 : decimals;

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: effectiveDecimals,
    maximumFractionDigits: effectiveDecimals,
  }).format(amount);

  return `${info.symbol}${formattedNumber}`;
}

/**
 * Formats percentage change with sign
 */
export function formatPercent(percent: number, showSign: boolean = true): string {
  const sign = percent > 0 && showSign ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Formats weight with unit symbol
 */
export function formatWeight(weight: number, unit: WeightUnit = 'gram'): string {
  const unitInfo = WEIGHT_UNITS[unit] || WEIGHT_UNITS.gram;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: weight % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 3,
  }).format(weight);

  return `${formattedNumber} ${unitInfo.symbol}`;
}

/**
 * Formats timestamp to human readable date and time
 */
export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Formats time only for compact tickers
 */
export function formatTimeCompact(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
}
