'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe } from 'lucide-react'
import { useCurrencyStore, SUPPORTED_CURRENCIES, type CurrencyCode } from '@/store/currency'

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCurrency, setCurrency, getCurrencyConfig } = useCurrencyStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentConfig = getCurrencyConfig()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectCurrency = (currency: CurrencyCode) => {
    setCurrency(currency)
    setIsOpen(false)
  }

  const currencyOptions = Object.entries(SUPPORTED_CURRENCIES).map(([code, config]) => ({
    code: code as CurrencyCode,
    ...config,
  }))

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#777777] hover:text-black hover:bg-gray-100 transition-all duration-200 tracking-[0.05em]"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline lowercase">{selectedCurrency}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              {currencyOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleSelectCurrency(option.code)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-150 text-sm ${
                    selectedCurrency === option.code
                      ? 'bg-gray-900 text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{option.symbol} {option.code}</div>
                      <div className={`text-xs ${selectedCurrency === option.code ? 'text-gray-300' : 'text-gray-500'}`}>
                        {option.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
