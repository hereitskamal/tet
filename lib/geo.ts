import type { CurrencyCode } from '@/store/currency'

/**
 * ISO 3166-1 alpha-2 country code → CurrencyCode
 * Countries not listed fall back to USD.
 */
const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  // Indian Rupee
  IN: 'INR',

  // British Pound
  GB: 'GBP',
  IE: 'GBP',
  GG: 'GBP',
  JE: 'GBP',
  IM: 'GBP',

  // Japanese Yen
  JP: 'JPY',

  // Australian Dollar
  AU: 'AUD',
  NZ: 'AUD',

  // Euro — EU member states + closely tied territories
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  LU: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  EE: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  CY: 'EUR',
  MT: 'EUR',
  HR: 'EUR',
  MC: 'EUR',
  SM: 'EUR',
  VA: 'EUR',
  AD: 'EUR',

  // US Dollar (explicit + default)
  US: 'USD',
  CA: 'USD',
  MX: 'USD',
  SG: 'USD',
  HK: 'USD',
  AE: 'USD',
  SA: 'USD',
  ZA: 'USD',
  NG: 'USD',
  BR: 'USD',
}

export const SUPPORTED_CURRENCY_CODES = new Set<CurrencyCode>([
  'INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD',
])

/**
 * Resolve a 2-letter ISO country code to a supported CurrencyCode.
 * Returns 'USD' for unknown countries.
 */
export function countryToCurrency(countryCode: string | null | undefined): CurrencyCode {
  if (!countryCode) return 'USD'
  const upper = countryCode.toUpperCase()
  const mapped = COUNTRY_CURRENCY_MAP[upper]
  return mapped ?? 'USD'
}
