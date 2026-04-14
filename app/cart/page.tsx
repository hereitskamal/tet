'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const cartTotal = total()

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-16">
        <AnimatedSection className="mb-12">
          <h1 className="text-display lowercase tracking-tight">cart.</h1>
          <p className="text-sm text-[#777777] mt-2">{items.length} objects</p>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection className="py-24">
            <p className="text-heading-xl lowercase tracking-tight text-[#e2e2e2] mb-4">empty.</p>
            <p className="text-sm text-[#777777] mb-8">your cart is waiting to be filled.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-[#e5e2e1] px-8 py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors"
            >
              browse objects <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2">
              <AnimatePresence initial={false}>
                {items.map((item, i) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-6 pb-8 mb-8 border-b border-[#e2e2e2] last:border-0"
                  >
                    <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-28 h-36 bg-[#e2e2e2] overflow-hidden rounded-sm">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={112}
                          height={144}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold lowercase tracking-tight leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#777777] mt-1 lowercase">
                            {item.product.category?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 hover:bg-[#e2e2e2] rounded-full transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-[#777777]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-[#e2e2e2] flex items-center justify-center hover:border-black transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={clearCart}
                className="text-xs text-[#777777] hover:text-black transition-colors lowercase mt-2"
              >
                clear cart
              </button>
            </div>

            {/* Summary */}
            <AnimatedSection direction="left" className="lg:sticky lg:top-28 self-start">
              <div className="bg-[#f3f3f4] p-8 rounded-sm">
                <h2 className="text-heading-md lowercase tracking-tight mb-8">summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-[#e2e2e2]">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-[#777777] lowercase truncate pr-4">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-sm text-[#777777] lowercase tracking-[0.05em]">total</span>
                  <span className="font-black text-2xl tracking-tight">{formatPrice(cartTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-black text-[#e5e2e1] py-4 rounded-full font-medium lowercase tracking-[0.05em] hover:bg-[#1a1a1a] transition-colors"
                >
                  checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products"
                  className="block text-center text-sm text-[#777777] hover:text-black transition-colors mt-4 lowercase"
                >
                  continue shopping
                </Link>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>
    </div>
  )
}
