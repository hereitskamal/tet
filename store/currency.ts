'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  exchangeRate: number // relative to USD
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRate: 83.5, // 1 USD = 83.5 INR (approximate)
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.92,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRate: 0.79,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    exchangeRate: 149.5,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    exchangeRate: 1.53,
  },
}

interface CurrencyStore {
  selectedCurrency: CurrencyCode
  /** True once the user has explicitly picked a currency via the selector. */
  hasUserOverride: boolean
  setCurrency: (currency: CurrencyCode) => void
  /**
   * Seed currency from geo detection (proxy → GeoInit).
   * Silently ignored when the user has already made an explicit choice.
   */
  initFromGeo: (currency: CurrencyCode) => void
  getCurrencyConfig: () => CurrencyConfig
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'USD',
      hasUserOverride: false,

      setCurrency: (currency: CurrencyCode) => {
        set({ selectedCurrency: currency, hasUserOverride: true })
      },

      initFromGeo: (currency: CurrencyCode) => {
        if (!get().hasUserOverride) {
          set({ selectedCurrency: currency })
        }
      },

      getCurrencyConfig: () => {
        return SUPPORTED_CURRENCIES[get().selectedCurrency]
      },
    }),
    {
      name: 'tht-currency',
      // Don't persist hasUserOverride across hard resets; only the chosen currency
      // and the override flag need to survive.
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        hasUserOverride: state.hasUserOverride,
      }),
    }
  )
)
