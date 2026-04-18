'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar from '@/components/shop/FilterSidebar'
import SearchBar from '@/components/shop/SearchBar'
import { SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/types'

// ── Grid icons ────────────────────────────────────────────────────────────────
function GridIcon3() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="4" height="4" rx="0.5" /><rect x="6" y="2" width="4" height="4" rx="0.5" /><rect x="12" y="2" width="4" height="4" rx="0.5" />
      <rect x="0" y="8" width="4" height="4" rx="0.5" /><rect x="6" y="8" width="4" height="4" rx="0.5" /><rect x="12" y="8" width="4" height="4" rx="0.5" />
    </svg>
  )
}
function GridIcon4() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="3" height="4" rx="0.5" /><rect x="4.3" y="2" width="3" height="4" rx="0.5" /><rect x="8.6" y="2" width="3" height="4" rx="0.5" /><rect x="13" y="2" width="3" height="4" rx="0.5" />
      <rect x="0" y="8" width="3" height="4" rx="0.5" /><rect x="4.3" y="8" width="3" height="4" rx="0.5" /><rect x="8.6" y="8" width="3" height="4" rx="0.5" /><rect x="13" y="8" width="3" height="4" rx="0.5" />
    </svg>
  )
}
function GridIcon5() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="2.2" height="4" rx="0.5" /><rect x="3.4" y="2" width="2.2" height="4" rx="0.5" /><rect x="6.9" y="2" width="2.2" height="4" rx="0.5" /><rect x="10.4" y="2" width="2.2" height="4" rx="0.5" /><rect x="13.8" y="2" width="2.2" height="4" rx="0.5" />
      <rect x="0" y="8" width="2.2" height="4" rx="0.5" /><rect x="3.4" y="8" width="2.2" height="4" rx="0.5" /><rect x="6.9" y="8" width="2.2" height="4" rx="0.5" /><rect x="10.4" y="8" width="2.2" height="4" rx="0.5" /><rect x="13.8" y="8" width="2.2" height="4" rx="0.5" />
    </svg>
  )
}
function GridIcon2() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="7" height="4" rx="0.5" /><rect x="9" y="2" width="7" height="4" rx="0.5" />
      <rect x="0" y="8" width="7" height="4" rx="0.5" /><rect x="9" y="8" width="7" height="4" rx="0.5" />
    </svg>
  )
}
function GridIcon1() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="16" height="4" rx="0.5" />
      <rect x="0" y="8" width="16" height="4" rx="0.5" />
    </svg>
  )
}

const desktopOptions = [
  { cols: 3, Icon: GridIcon3 },
  { cols: 4, Icon: GridIcon4 },
  { cols: 5, Icon: GridIcon5 },
]
const mobileOptions = [
  { cols: 2, Icon: GridIcon2 },
  { cols: 1, Icon: GridIcon1 },
]

// ── Main content ──────────────────────────────────────────────────────────────
function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [desktopCols, setDesktopCols] = useState(3)
  const [mobileCols, setMobileCols] = useState(2)

  const searchParamsStr = searchParams.toString()

  useEffect(() => {
    setLoading(true)
    fetch('/api/products?' + searchParamsStr)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
  }, [searchParamsStr])

  const category = searchParams.get('category') || ''
  const q = searchParams.get('q') || ''
  const headline = q ? `results for "${q}"` : category ? category : 'all objects'

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Title */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-2">
            {products.length} objects
          </p>
          <h1 className="text-display font-black lowercase">{headline}</h1>
        </div>

        {/* Sticky controls bar */}
        <div className="sticky top-16 z-10 bg-[#f9f9f9] flex items-center justify-between border-b border-[#e2e2e2] py-4 gap-4">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm lowercase text-[#777777] hover:text-black transition-colors lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            filter
          </button>

          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile col toggles */}
            <div className="flex items-center gap-1 lg:hidden">
              {mobileOptions.map(({ cols, Icon }) => (
                <button
                  key={cols}
                  onClick={() => setMobileCols(cols)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    mobileCols === cols ? 'bg-black text-white' : 'text-[#aaa] hover:text-black'
                  }`}
                >
                  <Icon />
                </button>
              ))}
              <div className="w-px h-5 bg-[#e2e2e2] mx-1" />
            </div>

            {/* Desktop col toggles */}
            <div className="hidden lg:flex items-center gap-1">
              {desktopOptions.map(({ cols, Icon }) => (
                <button
                  key={cols}
                  onClick={() => setDesktopCols(cols)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    desktopCols === cols ? 'bg-black text-white' : 'text-[#aaa] hover:text-black'
                  }`}
                >
                  <Icon />
                </button>
              ))}
              <div className="w-px h-5 bg-[#e2e2e2] mx-1" />
            </div>

            <SearchBar />
          </div>
        </div>

        {/* Body: sidebar + grid */}
        <div className="flex gap-12 mt-10">

          {/* Sticky sidebar */}
          <div className="hidden lg:block w-44 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar isOpen={true} onClose={() => {}} />
            </div>
          </div>

          {/* Grid — normal page scroll */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-[#e2e2e2] rounded-sm mb-4" />
                    <div className="h-4 bg-[#e2e2e2] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#e2e2e2] rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products} cols={desktopCols} mobileCols={mobileCols} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterSidebar isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
