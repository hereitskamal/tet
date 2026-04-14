'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { useCurrency } from '@/hooks/useCurrency'
import ProductGrid from '@/components/shop/ProductGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

interface Props {
  product: Product
  related: Product[]
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addItem } = useCartStore()
  const { formatPrice } = useCurrency()
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const prevImage = () => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)
  const nextImage = () => setActiveImage((i) => (i + 1) % product.images.length)

  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 mb-4">
        <nav className="flex items-center gap-2 text-xs text-[#777777] lowercase">
          <Link href="/products" className="hover:text-black transition-colors">shop</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category?.slug}`} className="hover:text-black transition-colors">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image gallery */}
          <div className="sticky top-24">
            <div className="relative aspect-square bg-[#e2e2e2] overflow-hidden rounded-sm mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 bg-[#e2e2e2] overflow-hidden rounded-sm transition-opacity ${
                      activeImage === i ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#777777] mb-4">
                {product.category?.name}
              </p>
              <h1 className="text-heading-xl lowercase tracking-tight leading-[1] mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl font-black tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.compareAt && (
                  <span className="text-lg text-[#777777] line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#777777] leading-relaxed mb-10 max-w-md">
                {product.description}
              </p>

              {/* Stock */}
              <p className={`text-xs tracking-[0.1em] uppercase mb-6 ${
                product.stock > 5 ? 'text-[#3b3d2b]' : product.stock > 0 ? 'text-[#777777]' : 'text-[#ba1a1a]'
              }`}>
                {product.stock > 5
                  ? 'in stock'
                  : product.stock > 0
                  ? `only ${product.stock} left`
                  : 'out of stock'}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-[0.1em] uppercase text-[#777777]">qty</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 bg-black text-[#e5e2e1] py-5 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <Check className="w-4 h-4" />
                      added to cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      add to cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Details */}
              <div className="border-t border-[#e2e2e2] pt-8 mt-8 space-y-4">
                {[
                  ['material', 'solid walnut, saddle leather, blackened steel'],
                  ['lead time', '4–6 weeks'],
                  ['origin', 'designed in new york, made in europe'],
                  ['care', 'wipe with dry cloth; oil finish annually'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-6 text-sm">
                    <span className="text-[#777777] lowercase w-24 flex-shrink-0 tracking-[0.05em]">{label}</span>
                    <span className="text-[#1a1c1c] lowercase leading-relaxed">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection className="mt-24 pt-12 border-t border-[#e2e2e2]">
            <h2 className="text-heading-md lowercase tracking-tight mb-12">
              complete the look
            </h2>
            <ProductGrid products={related} />
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
