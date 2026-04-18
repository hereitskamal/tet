'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  cols?: number // desktop cols: 3 | 4 | 5
  mobileCols?: number // mobile cols: 1 | 2
}

const desktopColsClass: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
}
const mobileColsClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
}

export default function ProductGrid({ products, cols = 3, mobileCols = 2 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-4xl font-black lowercase tracking-tight text-[#e2e2e2]">no objects found.</p>
        <p className="text-sm text-[#777777] mt-3">try adjusting your filters.</p>
      </div>
    )
  }

  const gridClass = `grid ${mobileColsClass[mobileCols] ?? 'grid-cols-2'} ${desktopColsClass[cols] ?? 'lg:grid-cols-3'} gap-x-4 gap-y-10`

  return (
    <motion.div
      className={gridClass}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </motion.div>
  )
}
