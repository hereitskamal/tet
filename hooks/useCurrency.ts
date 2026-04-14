'use client'

import { useMemo } from 'react'
import { useCurrencyStore } from '@/store/currency'
import { convertPrice, convertToUSD, formatPrice, getCurrencySymbol } from '@/lib/currency'

/**
 * Custom hook to use currency in components
 * Provides converted prices and formatting utilities
 */
export function useCurrency() {
  const { selectedCurrency } = useCurrencyStore()

  return useMemo(
    () => ({
      currency: selectedCurrency,
      convertPrice: (usdPrice: number) => convertPrice(usdPrice, selectedCurrency),
      convertToUSD: (price: number) => convertToUSD(price, selectedCurrency),
      formatPrice: (usdPrice: number) => formatPrice(usdPrice, selectedCurrency),
      getSymbol: () => getCurrencySymbol(selectedCurrency),
    }),
    [selectedCurrency]
  )
}
