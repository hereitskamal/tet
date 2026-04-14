'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCurrency } from '@/hooks/useCurrency'

const categories = [
  { slug: '', label: 'all objects' },
  { slug: 'living-room-furniture', label: 'living room' },
  { slug: 'bedroom-furniture', label: 'bedroom' },
  { slug: 'dining-room-furniture', label: 'dining room' },
  { slug: 'office-furniture', label: 'office' },
  { slug: 'decorative-accessories', label: 'decorative' },
  { slug: 'lighting', label: 'lighting' },
  { slug: 'rugs-carpets', label: 'rugs & carpets' },
  { slug: 'wall-art-mirrors', label: 'wall art & mirrors' },
  { slug: 'kitchen-dining', label: 'kitchen & dining' },
  { slug: 'bathroom-accessories', label: 'bathroom accessories' },
  { slug: 'outdoor-furniture', label: 'outdoor' },
  { slug: 'storage-solutions', label: 'storage solutions' },
]

const MIN_FILTER_USD = 0
const MAX_FILTER_USD = 10000
const SLIDER_STEP_USD = 50

const pricePresets = [
  { label: 'all prices', min: '', max: '' },
  { label: 'under', value: 1000, min: '', max: '1000' },
  { label: 'range', minValue: 1000, maxValue: 3000, min: '1000', max: '3000' },
  { label: 'range', minValue: 3000, maxValue: 6000, min: '3000', max: '6000' },
  { label: 'over', value: 6000, min: '6000', max: '' },
]

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { formatPrice, convertPrice } = useCurrency()
  const [rangeMinUSD, setRangeMinUSD] = useState<number>(MIN_FILTER_USD)
  const [rangeMaxUSD, setRangeMaxUSD] = useState<number>(MAX_FILTER_USD)

  const activeCategory = searchParams.get('category') || ''
  const activeMin = searchParams.get('min') || ''
  const activeMax = searchParams.get('max') || ''

  useEffect(() => {
    setRangeMinUSD(activeMin ? parseFloat(activeMin) : MIN_FILTER_USD)
    setRangeMaxUSD(activeMax ? parseFloat(activeMax) : MAX_FILTER_USD)
  }, [activeMin, activeMax])

  const priceRanges = useMemo(() => {
    return pricePresets.map((range) => {
      if (range.label === 'all prices') {
        return { ...range, displayLabel: 'all prices' }
      }
      if (range.label === 'under') {
        return {
          ...range,
          displayLabel: `under ${formatPrice(range.value!)}`,
        }
      }
      if (range.label === 'over') {
        return {
          ...range,
          displayLabel: `over ${formatPrice(range.value!)}`,
        }
      }
      return {
        ...range,
        displayLabel: `${formatPrice(range.minValue!)} – ${formatPrice(range.maxValue!)}`,
      }
    })
  }, [formatPrice])

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value)
        } else {
          current.delete(key)
        }
      })
      return current.toString()
    },
    [searchParams]
  )

  const setCategory = (slug: string) => {
    router.push(pathname + '?' + createQueryString({ category: slug, page: '' }))
  }

  const setPriceRange = (min: string, max: string) => {
    router.push(pathname + '?' + createQueryString({ min, max, page: '' }))
  }

  const handleSliderMinChange = (value: number) => {
    setRangeMinUSD(Math.min(value, rangeMaxUSD - SLIDER_STEP_USD))
  }

  const handleSliderMaxChange = (value: number) => {
    setRangeMaxUSD(Math.max(value, rangeMinUSD + SLIDER_STEP_USD))
  }

  const applySliderRange = () => {
    setPriceRange(
      rangeMinUSD > MIN_FILTER_USD ? String(rangeMinUSD) : '',
      rangeMaxUSD < MAX_FILTER_USD ? String(rangeMaxUSD) : ''
    )
  }

  const resetSliderRange = () => {
    setRangeMinUSD(MIN_FILTER_USD)
    setRangeMaxUSD(MAX_FILTER_USD)
    setPriceRange('', '')
  }

  const sliderMinLabel = rangeMinUSD === MIN_FILTER_USD ? 'any' : formatPrice(rangeMinUSD)
  const sliderMaxLabel = rangeMaxUSD === MAX_FILTER_USD ? 'any' : formatPrice(rangeMaxUSD)
  const sliderRangeLeft = (rangeMinUSD / MAX_FILTER_USD) * 100
  const sliderRangeRight = 100 - (rangeMaxUSD / MAX_FILTER_USD) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#f9f9f9] p-8 overflow-y-auto md:static md:z-auto md:block md:w-auto md:bg-transparent md:p-0 md:overflow-visible"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-8 md:hidden">
              <h2 className="font-black lowercase tracking-tight text-lg">filters</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#e2e2e2] rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category */}
            <div className="mb-10">
              <h3 className="text-[10px] tracking-[0.15em] uppercase text-[#777777] mb-4">
                category
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => setCategory(cat.slug)}
                      className={`text-sm lowercase w-full text-left py-1 transition-colors ${
                        activeCategory === cat.slug
                          ? 'font-bold text-black'
                          : 'text-[#777777] hover:text-black'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-[10px] tracking-[0.15em] uppercase text-[#777777] mb-4">
                price
              </h3>

              <div className="mb-4 text-sm lowercase flex items-center justify-between gap-4">
                <span className="font-medium">{sliderMinLabel}</span>
                <span className="font-medium">{sliderMaxLabel}</span>
              </div>

              <div className="relative h-2 rounded-full bg-[#e2e2e2] overflow-hidden">
                <div
                  className="absolute inset-y-0 bg-black rounded-full"
                  style={{ left: `${sliderRangeLeft}%`, right: `${sliderRangeRight}%` }}
                />
              </div>

              <div className="relative mt-6 h-10">
                <input
                  type="range"
                  min={MIN_FILTER_USD}
                  max={MAX_FILTER_USD}
                  step={SLIDER_STEP_USD}
                  value={rangeMinUSD}
                  onChange={(event) => handleSliderMinChange(Number(event.target.value))}
                  className="absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent opacity-0"
                  style={{ zIndex: 20 }}
                />
                <input
                  type="range"
                  min={MIN_FILTER_USD}
                  max={MAX_FILTER_USD}
                  step={SLIDER_STEP_USD}
                  value={rangeMaxUSD}
                  onChange={(event) => handleSliderMaxChange(Number(event.target.value))}
                  className="absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent opacity-0"
                  style={{ zIndex: 10 }}
                />

                <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-[#e2e2e2]" />
                <div
                  className="absolute top-1/2 h-2 rounded-full bg-black -translate-y-1/2"
                  style={{ left: `${sliderRangeLeft}%`, right: `${sliderRangeRight}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-black border-4 border-white shadow-lg"
                  style={{ left: `calc(${sliderRangeLeft}% - 0.75rem)` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-black border-4 border-white shadow-lg"
                  style={{ left: `calc(${100 - sliderRangeRight}% - 0.75rem)` }}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={applySliderRange}
                  className="px-4 py-2 bg-black text-[#e5e2e1] rounded-full text-sm lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors"
                >
                  apply
                </button>
                <button
                  onClick={resetSliderRange}
                  className="px-4 py-2 text-sm lowercase tracking-[0.05em] text-[#777777] hover:text-black transition-colors"
                >
                  clear
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {priceRanges.map((range) => {
                  const isActive = activeMin === range.min && activeMax === range.max
                  const key = `${range.min}-${range.max}`
                  return (
                    <li key={key} className="list-none">
                      <button
                        onClick={() => setPriceRange(range.min, range.max)}
                        className={`text-sm lowercase w-full text-left py-1 transition-colors ${
                          isActive
                            ? 'font-bold text-black'
                            : 'text-[#777777] hover:text-black'
                        }`}
                      >
                        {range.displayLabel}
                      </button>
                    </li>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
