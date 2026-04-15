'use client'

/**
 * GeoInit — zero-render client component that seeds the currency store with
 * the server-detected geo currency.
 *
 * Props:
 *   geoCurrency — ISO currency code detected by proxy.ts and forwarded by
 *                 app/layout.tsx via the x-geo-currency request header.
 *                 Falls back to reading the `geo-currency` cookie when the
 *                 header is unavailable (e.g. during client-side navigations).
 *
 * Precedence (enforced inside the store):
 *   user's explicit choice  >  geo-detected  >  store default (USD)
 */

import { useEffect } from 'react'
import { useCurrencyStore, type CurrencyCode, SUPPORTED_CURRENCIES } from '@/store/currency'

const SUPPORTED = new Set(Object.keys(SUPPORTED_CURRENCIES))

function readGeoCookie(): CurrencyCode | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)geo-currency=([A-Z]{3})/)
  const code = match?.[1]
  return code && SUPPORTED.has(code) ? (code as CurrencyCode) : null
}

interface GeoInitProps {
  /** Resolved by app/layout.tsx from the x-geo-currency request header. */
  geoCurrency: CurrencyCode | null
}

export default function GeoInit({ geoCurrency }: GeoInitProps) {
  const initFromGeo = useCurrencyStore((s) => s.initFromGeo)

  useEffect(() => {
    // Prefer the server-forwarded value (avoids cookie parse on every mount).
    // Fall back to the cookie for client-side navigations where the prop might
    // be stale or the layout hasn't re-run.
    const currency = geoCurrency ?? readGeoCookie()
    if (currency) {
      initFromGeo(currency)
    }
    // Only run once per mount — geoCurrency is stable for the lifetime of
    // the layout (it's set by the proxy on each full page load).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
