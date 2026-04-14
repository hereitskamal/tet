'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar from '@/components/shop/FilterSidebar'
import SearchBar from '@/components/shop/SearchBar'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

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
  const headline = q
    ? `results for "${q}"`
    : category
    ? category
    : 'all objects'

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-3">
            {products.length} objects
          </p>
          <h1 className="text-display font-black lowercase">{headline}</h1>
        </AnimatedSection>

        {/* Controls */}
        <div className="flex items-center justify-between mb-10 border-b border-[#e2e2e2] pb-6">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm lowercase text-[#777777] hover:text-black transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            filter
          </button>
          <SearchBar />
        </div>

        <div className="flex gap-12">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-44 flex-shrink-0">
            <FilterSidebar isOpen={true} onClose={() => {}} />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-[#e2e2e2] rounded-sm mb-4" />
                    <div className="h-4 bg-[#e2e2e2] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#e2e2e2] rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
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
