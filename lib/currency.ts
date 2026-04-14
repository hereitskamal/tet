import { SUPPORTED_CURRENCIES, CurrencyCode } from '@/store/currency'

const BASE_CURRENCY: CurrencyCode = 'USD' // Base price is stored in USD

/**
 * Convert price from base currency (USD) to target currency
 */
export function convertPrice(usdPrice: number, targetCurrency: CurrencyCode): number {
  const rate = SUPPORTED_CURRENCIES[targetCurrency].exchangeRate
  return usdPrice * rate
}

export function convertToUSD(price: number, sourceCurrency: CurrencyCode): number {
  const rate = SUPPORTED_CURRENCIES[sourceCurrency].exchangeRate
  return price / rate
}

/**
 * Format price with currency symbol and localization
 */
export function formatPrice(
  price: number,
  currency: CurrencyCode,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  const config = SUPPORTED_CURRENCIES[currency]
  const converted = convertPrice(price, currency)

  // Determine decimal places based on currency
  let decimals = options?.maximumFractionDigits ?? getDecimalPlaces(currency)

  // Format based on currency
  const formatted = new Intl.NumberFormat(getCurrencyLocale(currency), {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: decimals,
  }).format(converted)

  // Return formatted string with symbol
  return `${config.symbol} ${formatted}`
}

/**
 * Get decimal places for a specific currency
 */
function getDecimalPlaces(currency: CurrencyCode): number {
  // JPY doesn't use decimals
  if (currency === 'JPY') return 0
  // Most others use 2 decimals
  return 2
}

/**
 * Get locale string for Intl API
 */
function getCurrencyLocale(currency: CurrencyCode): string {
  const localeMap: Record<CurrencyCode, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    AUD: 'en-AU',
  }
  return localeMap[currency]
}

/**
 * Get currency symbol from code
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[currency].symbol
}

/**
 * Get currency name from code
 */
export function getCurrencyName(currency: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[currency].name
}
